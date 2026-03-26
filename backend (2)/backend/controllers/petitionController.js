const Petition = require("../models/Petition");
const Signature = require("../models/Signature");
const User = require("../models/User");

const VALID_STATUSES = ["active", "closed", "resolved", "under_review"];
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const petition = new Petition({
      title,
      description,
      category,
      location,
      creator: req.user.id
    });

    await petition.save();

    res.status(201).json({
      message: "Petition created successfully",
      petition
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getAllPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find()
      .populate("creator", "name email role location")
      .populate("officialResponses.official", "name email role location")
      .sort({ createdAt: -1 });

    res.status(200).json(petitions);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};





exports.editPetition = async (req, res) => {
  try {
    const { id } = req.params;

    const petition = await Petition.findById(id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    // allow only creator to edit
    if (petition.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Petition.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Petition updated successfully",
      petition: updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.deletePetition = async (req, res) => {
  try {
    const { id } = req.params;

    const petition = await Petition.findById(id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Petition.findByIdAndDelete(id);
    await Signature.deleteMany({ petition: id });

    res.json({ message: "Petition deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.filterPetitions = async (req, res) => {
  try {
    const { location, category } = req.query;

    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const petitions = await Petition.find(filter);

    res.json(petitions);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const petition = await Petition.findById(id);

    if (!petition)
      return res.status(404).json({ message: "Petition not found" });

    const actor = await User.findById(req.user.id).select("role");
    if (!actor) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCreator = petition.creator.toString() === req.user.id;
    const isOfficial = actor.role === "official";

    if (!isCreator && !isOfficial)
      return res.status(403).json({
        message: "Only petition creator or official can update status"
      });

    petition.status = status;
    await petition.save();

    res.json({
      message: "Status updated successfully",
      petition
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOfficialLocalityPetitions = async (req, res) => {
  try {
    const actor = await User.findById(req.user.id).select("role location");

    if (!actor) {
      return res.status(404).json({ message: "User not found" });
    }

    if (actor.role !== "official") {
      return res.status(403).json({ message: "Only officials can access locality petitions" });
    }

    const normalizedLocation = String(actor.location || "").trim();
    if (!normalizedLocation) {
      return res.status(400).json({ message: "Official profile is missing location" });
    }

    const petitions = await Petition.find({
      location: { $regex: `^${escapeRegex(normalizedLocation)}$`, $options: "i" }
    })
      .populate("creator", "name email role location")
      .populate("officialResponses.official", "name email role location")
      .sort({ createdAt: -1 });

    res.status(200).json(petitions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.respondToPetitionAsOfficial = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, status } = req.body;

    const actor = await User.findById(req.user.id).select("role location");
    if (!actor) {
      return res.status(404).json({ message: "User not found" });
    }

    if (actor.role !== "official") {
      return res.status(403).json({ message: "Only officials can respond to petitions" });
    }

    const petition = await Petition.findById(id);
    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    const officialLocation = String(actor.location || "").trim().toLowerCase();
    const petitionLocation = String(petition.location || "").trim().toLowerCase();

    if (!officialLocation || officialLocation !== petitionLocation) {
      return res.status(403).json({ message: "Officials can respond only to petitions in their locality" });
    }

    const cleanComment = String(comment || "").trim();
    if (!cleanComment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    let resolvedStatus = "under_review";
    if (typeof status === "string" && status.trim()) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      resolvedStatus = status;
    }

    petition.status = resolvedStatus;
    petition.officialResponses.push({
      official: req.user.id,
      comment: cleanComment,
      status: resolvedStatus
    });

    await petition.save();

    const refreshed = await Petition.findById(id)
      .populate("creator", "name email role location")
      .populate("officialResponses.official", "name email role location");

    res.status(200).json({
      message: "Official response submitted",
      petition: refreshed
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.signPetition = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // check petition exists
    const petition = await Petition.findById(id);
    if (!petition)
      return res.status(404).json({ message: "Petition not found" });

    // create signature (unique index handles duplicate)
    await Signature.create({
      petition: id,
      user: userId
    });

    // increment count safely
    await Petition.findByIdAndUpdate(id, {
      $inc: { signatureCount: 1 },
      $addToSet: { signatures: userId }
    });

    res.json({
      message: "Petition signed successfully"
    });

  } catch (error) {

    // duplicate sign attempt
    if (error.code === 11000) {
      return res.status(200).json({
        message: "You already signed this petition"
      });
    }

    res.status(500).json({ error: error.message });
  }
}; 
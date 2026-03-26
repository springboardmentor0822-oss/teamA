const Petition = require("../models/Petition");
const Poll = require("../models/Poll");
const User = require("../models/User");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseMonth = (monthValue) => {
  if (!monthValue) {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  }

  const match = String(monthValue).match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;

  if (month < 0 || month > 11) {
    return null;
  }

  return { year, month };
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("role location");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parsedMonth = parseMonth(req.query.month);
    if (!parsedMonth) {
      return res.status(400).json({ message: "Invalid month. Use YYYY-MM" });
    }

    const monthStart = new Date(Date.UTC(parsedMonth.year, parsedMonth.month, 1, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(parsedMonth.year, parsedMonth.month + 1, 1, 0, 0, 0));

    const petitionQuery = {
      createdAt: { $gte: monthStart, $lt: monthEnd },
    };

    const pollQuery = {
      createdAt: { $gte: monthStart, $lt: monthEnd },
    };

    let scope = "community";

    if (user.role === "official") {
      const location = String(user.location || "").trim();
      if (!location) {
        return res.status(400).json({ message: "Official profile is missing location" });
      }

      const locationRegex = { $regex: `^${escapeRegex(location)}$`, $options: "i" };
      petitionQuery.location = locationRegex;
      pollQuery.$or = [
        { city: locationRegex },
        { state: locationRegex },
      ];
      scope = `official:${location}`;
    }

    const [petitions, polls] = await Promise.all([
      Petition.find(petitionQuery),
      Poll.find(pollQuery),
    ]);

    const totalSignatures = petitions.reduce(
      (sum, petition) => sum + (Number(petition.signatureCount) || 0),
      0
    );

    const totalVotes = polls.reduce((sum, poll) => {
      const pollVotes = Array.isArray(poll.options)
        ? poll.options.reduce((optionSum, option) => optionSum + (Number(option.votes) || 0), 0)
        : 0;
      return sum + pollVotes;
    }, 0);

    const petitionStatusBreakdown = petitions.reduce(
      (acc, petition) => {
        const status = String(petition.status || "active");
        if (!Object.prototype.hasOwnProperty.call(acc, status)) {
          acc[status] = 0;
        }
        acc[status] += 1;
        return acc;
      },
      { active: 0, under_review: 0, resolved: 0, closed: 0 }
    );

    const report = {
      month: `${parsedMonth.year}-${String(parsedMonth.month + 1).padStart(2, "0")}`,
      generatedAt: new Date().toISOString(),
      scope,
      totals: {
        petitionsCreated: petitions.length,
        pollsCreated: polls.length,
        totalSignatures,
        totalVotes,
        activeEngagement: petitions.length + polls.length,
      },
      petitionStatusBreakdown,
    };

    res.status(200).json(report);
  } catch (error) {
    console.error("getMonthlyReport error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

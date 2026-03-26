const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const { createPetition } = require("../controllers/petitionController");
router.post("/create", auth, createPetition);


const { getAllPetitions } = require("../controllers/petitionController");
router.get("/all", getAllPetitions);



const { editPetition } = require("../controllers/petitionController");
router.put("/edit/:id", auth, editPetition);

const { deletePetition } = require("../controllers/petitionController");
router.delete("/delete/:id", auth, deletePetition);

const { filterPetitions } = require("../controllers/petitionController");
router.get("/filter", filterPetitions);

const { updateStatus } = require("../controllers/petitionController");
router.patch("/status/:id", auth, updateStatus);

const {
	getOfficialLocalityPetitions,
	respondToPetitionAsOfficial,
} = require("../controllers/petitionController");
router.get("/official/locality", auth, getOfficialLocalityPetitions);
router.post("/official/respond/:id", auth, respondToPetitionAsOfficial);

const { signPetition } = require("../controllers/petitionController");
router.patch("/sign/:id", auth, signPetition);


module.exports = router;
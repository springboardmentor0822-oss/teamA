const express = require("express");
const router = express.Router();

const { getOfficialsDirectory } = require("../controllers/officialController");

router.get("/directory", getOfficialsDirectory);

module.exports = router;

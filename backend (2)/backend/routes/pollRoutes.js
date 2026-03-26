const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createPoll,
  getAllPolls,
  votePoll,
  closePoll,
  deletePoll,
} = require("../controllers/pollController");

router.post("/create", auth, createPoll);
router.get("/all", getAllPolls);
router.patch("/vote/:id", auth, votePoll);
router.patch("/close/:id", auth, closePoll);
router.delete("/delete/:id", auth, deletePoll);

module.exports = router;

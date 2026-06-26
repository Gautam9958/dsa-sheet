const express = require("express");
const router = express.Router();
const { getMyProgress, toggleProgress } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyProgress);
router.post("/toggle", protect, toggleProgress);

module.exports = router;

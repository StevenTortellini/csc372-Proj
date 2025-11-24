const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");

// GET /songs/search?q=...
router.get("/search", songController.search);

module.exports = router;

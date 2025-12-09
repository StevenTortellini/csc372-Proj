// server/routes/spotifyRoutes.js
const express = require("express");
const router = express.Router();

const spotifyController = require("../controllers/spotifyController");
const requireAuth = require("../middleware/reqAuth");

router.get("/search", requireAuth, spotifyController.search);

module.exports = router;

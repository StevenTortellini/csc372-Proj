// server/routes/authRoutes.js
"use strict";
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Spotify OAuth routes
router.get("/spotify/login", authController.spotifyLogin);
router.get("/spotify/callback", authController.spotifyCallback);

// Session-based helpers
router.get("/me", authController.me);
router.post("/logout", authController.logout);

module.exports = router;

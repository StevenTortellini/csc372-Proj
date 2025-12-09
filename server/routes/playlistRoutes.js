// server/routes/playlistRoutes.js
const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController");
const requireAuth = require("../middleware/reqAuth");

// CRUD for playlists
router.get("/", requireAuth, playlistController.getAll);
router.get("/:id", requireAuth, playlistController.getById);
router.post("/", requireAuth, playlistController.create);
router.put("/:id", requireAuth, playlistController.update);
router.delete("/:id", requireAuth, playlistController.remove);

// Songs nested under a playlist
router.get("/:id/songs", requireAuth, playlistController.getSongs);
router.delete(
  "/:id/songs/:songId",
  requireAuth,
  playlistController.removeSong
);

module.exports = router;

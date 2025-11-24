const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

// GET /playlists
router.get("/", playlistController.getAll);

// GET /playlists/:id
router.get("/:id", playlistController.getById);

// POST /playlists
router.post("/", playlistController.create);

// PUT /playlists/:id
router.put("/:id", playlistController.update);

// DELETE /playlists/:id
router.delete("/:id", playlistController.remove);

module.exports = router;

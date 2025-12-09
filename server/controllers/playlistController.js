// server/controllers/playlistController.js
"use strict";

const Playlist = require("../models/playlistModel");

// GET /playlists
async function getAll(req, res) {
  try {
    const playlists = await Playlist.getAllByUser(req.user.id);
    res.json({ playlists });
  } catch (err) {
    console.error("playlistController.getAll error:", err);
    res.status(500).json({ error: "Failed to load playlists" });
  }
}

// GET /playlists/:id
async function getById(req, res) {
  try {
    const id = Number(req.params.id);
    const playlist = await Playlist.getById(id, req.user.id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.json({ playlist });
  } catch (err) {
    console.error("playlistController.getById error:", err);
    res.status(500).json({ error: "Failed to load playlist" });
  }
}

// POST /playlists
async function create(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    const playlist = await Playlist.create(req.user.id, name.trim());
    res.status(201).json({ playlist });
  } catch (err) {
    console.error("playlistController.create error:", err);
    res.status(500).json({ error: "Failed to create playlist" });
  }
}

// PUT /playlists/:id
async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const playlist = await Playlist.update(id, req.user.id, name.trim());
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json({ playlist });
  } catch (err) {
    console.error("playlistController.update error:", err);
    res.status(500).json({ error: "Failed to update playlist" });
  }
}

// DELETE /playlists/:id
async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    const deleted = await Playlist.remove(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("playlistController.remove error:", err);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
}

// GET /playlists/:id/songs
async function getSongs(req, res) {
  try {
    const id = Number(req.params.id);
    const songs = await Playlist.getSongs(id, req.user.id);
    res.json({ songs });
  } catch (err) {
    console.error("playlistController.getSongs error:", err);
    res.status(500).json({ error: "Failed to load songs for playlist" });
  }
}

// DELETE /playlists/:id/songs/:songId
async function removeSong(req, res) {
  try {
    const playlistId = Number(req.params.id);
    const songId = Number(req.params.songId);

    const removed = await Playlist.removeSong(
      playlistId,
      songId,
      req.user.id
    );

    if (!removed) {
      return res.status(404).json({ error: "Song not in playlist" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("playlistController.removeSong error:", err);
    res.status(500).json({ error: "Failed to remove song from playlist" });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getSongs,
  removeSong,
};

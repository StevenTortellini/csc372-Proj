// server/controllers/songController.js
"use strict";

const Song = require("../models/songModel");
const Playlist = require("../models/playlistModel");

// POST /songs — add a song to a playlist
async function create(req, res) {
  try {
    const userId = req.user.id;
    const {
      playlist_id,
      title,
      artist,
      album,
      api_id,
      mood,
    } = req.body;

    if (!playlist_id || !title || !artist || !api_id || !mood) {
      return res.status(400).json({ error: "Missing required song fields" });
    }

    // Ensure playlist belongs to this user
    const playlist = await Playlist.getById(playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    if (playlist.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const newSong = await Song.create({
      playlist_id,
      title,
      artist,
      album: album || null,
      api_id,
      mood,
    });

    res.status(201).json({ song: newSong });
  } catch (err) {
    console.error("Song create error:", err);
    res.status(500).json({ error: "Failed to add song" });
  }
}

// GET /songs/playlist/:playlistId — all songs in a playlist
async function getByPlaylist(req, res) {
  try {
    const userId = req.user.id;
    const playlistId = req.params.playlistId;

    const playlist = await Playlist.getById(playlistId);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    if (playlist.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const songs = await Song.getByPlaylistId(playlistId);
    res.json({ songs });
  } catch (err) {
    console.error("Song getByPlaylist error:", err);
    res.status(500).json({ error: "Failed to load songs" });
  }
}

// PUT /songs/:id — update song (e.g. mood)
async function update(req, res) {
  try {
    const userId = req.user.id;
    const songId = req.params.id;

    const existing = await Song.getById(songId);
    if (!existing) return res.status(404).json({ error: "Song not found" });

    const playlist = await Playlist.getById(existing.playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    if (playlist.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const { title, artist, album, api_id, mood } = req.body;

    const updated = await Song.update(songId, {
      title: title || existing.title,
      artist: artist || existing.artist,
      album: album ?? existing.album,
      api_id: api_id || existing.api_id,
      mood: mood ?? existing.mood,
    });

    res.json({ song: updated });
  } catch (err) {
    console.error("Song update error:", err);
    res.status(500).json({ error: "Failed to update song" });
  }
}

// DELETE /songs/:id
async function remove(req, res) {
  try {
    const userId = req.user.id;
    const songId = req.params.id;

    const existing = await Song.getById(songId);
    if (!existing) return res.status(404).json({ error: "Song not found" });

    const playlist = await Playlist.getById(existing.playlist_id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    if (playlist.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const ok = await Song.remove(songId);
    if (!ok) return res.status(404).json({ error: "Song not found" });

    res.json({ ok: true });
  } catch (err) {
    console.error("Song delete error:", err);
    res.status(500).json({ error: "Failed to delete song" });
  }
}

module.exports = { create, getByPlaylist, update, remove };

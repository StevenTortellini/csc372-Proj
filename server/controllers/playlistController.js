const Playlist = require("../models/playlistModel");

async function getAll(req, res) {
  try {
    const playlists = await Playlist.getAll();
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load playlists" });
  }
}

async function getById(req, res) {
  try {
    const pl = await Playlist.getById(req.params.id);
    if (!pl) return res.status(404).json({ error: "Playlist not found" });
    res.json(pl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load playlist" });
  }
}

async function create(req, res) {
  try {
    const { user_id, title, description } = req.body;
    const newPl = await Playlist.create({ user_id, title, description });
    res.status(201).json(newPl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create playlist" });
  }
}

async function update(req, res) {
  try {
    const { title, description } = req.body;
    const updated = await Playlist.update(req.params.id, { title, description });
    if (!updated) return res.status(404).json({ error: "Playlist not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update playlist" });
  }
}

async function remove(req, res) {
  try {
    const ok = await Playlist.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: "Playlist not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
}

module.exports = { getAll, getById, create, update, remove };

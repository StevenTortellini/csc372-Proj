// server/models/playlistModel.js
const pool = require("./db");

// Get all playlists
async function getAll() {
  const result = await pool.query(
    `SELECT * FROM playlists ORDER BY id DESC`
  );
  return result.rows;
}

// Get a single playlist
async function getById(id) {
  const result = await pool.query(
    `SELECT * FROM playlists WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

// Create a new playlist
async function create({ user_id, title, description }) {
  const result = await pool.query(
    `INSERT INTO playlists (user_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, title, description || null]
  );
  return result.rows[0];
}

// Update a playlist
async function update(id, { title, description }) {
  const result = await pool.query(
    `UPDATE playlists
     SET title = $1,
         description = $2
     WHERE id = $3
     RETURNING *`,
    [title, description || null, id]
  );
  return result.rows[0];
}

// Delete a playlist
async function remove(id) {
  const result = await pool.query(
    `DELETE FROM playlists WHERE id = $1`,
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

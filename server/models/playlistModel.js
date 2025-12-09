// server/models/playlistModel.js
const pool = require("./db");

// Get all playlists (optionally by user)
async function getAll() {
  const result = await pool.query(
    `SELECT * FROM playlists ORDER BY id DESC`
  );
  return result.rows;
}

// Get all playlists for a specific user
async function getAllByUser(userId) {
  const result = await pool.query(
    `SELECT * FROM playlists
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  );
  return result.rows;
}

// Get one playlist by id
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

// Update playlist title/description
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

// Delete playlist
async function remove(id) {
  const result = await pool.query(
    `DELETE FROM playlists WHERE id = $1`,
    [id]
  );
  return result.rowCount > 0;
}
async function getSongs(playlistId, userId) {
  const res = await pool.query(
    `
    SELECT
      s.id,
      s.title,
      s.artist,
      s.album,
      s.api_id,
      s.mood
    FROM songs s
    JOIN playlists p ON p.id = s.playlist_id
    WHERE s.playlist_id = $1
      AND p.user_id = $2
    ORDER BY s.id ASC
    `,
    [playlistId, userId]
  );

  return res.rows;
}


module.exports = {
  getAll,
  getAllByUser,
  getById,
  create,
  update,
  remove,
  getSongs,
};

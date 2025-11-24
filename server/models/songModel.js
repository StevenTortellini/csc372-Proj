// server/models/songModel.js
const pool = require("./db");

// Get songs by playlist
async function getByPlaylistId(playlist_id) {
  const result = await pool.query(
    `SELECT * FROM songs WHERE playlist_id = $1 ORDER BY id DESC`,
    [playlist_id]
  );
  return result.rows;
}

// Get a single song by ID
async function getById(id) {
  const result = await pool.query(
    `SELECT * FROM songs WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

// Add song to playlist
async function create({ playlist_id, title, artist, album, api_id, mood }) {
  const result = await pool.query(
    `INSERT INTO songs (playlist_id, title, artist, album, api_id, mood)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      playlist_id,
      title,
      artist,
      album || null,
      api_id || null,
      mood || null
    ]
  );

  return result.rows[0];
}

// Update song metadata
async function update(id, { title, artist, album, api_id, mood }) {
  const result = await pool.query(
    `UPDATE songs
     SET title = $1,
         artist = $2,
         album = $3,
         api_id = $4,
         mood = $5
     WHERE id = $6
     RETURNING *`,
    [
      title,
      artist,
      album || null,
      api_id || null,
      mood || null,
      id
    ]
  );

  return result.rows[0];
}

// Delete a song
async function remove(id) {
  const result = await pool.query(
    `DELETE FROM songs WHERE id = $1`,
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  getByPlaylistId,
  getById,
  create,
  update,
  remove
};

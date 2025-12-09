// server/models/userModel.js
const pool = require("./db");

// Find user by internal numeric ID (for sessions)
async function findById(id) {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

// Find user by Spotify ID
async function findBySpotifyId(spotifyId) {
  const result = await pool.query(
    `SELECT * FROM users WHERE spotify_id = $1`,
    [spotifyId]
  );
  return result.rows[0];
}

// Find user by email (optional)
async function findByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

// Create a user from Spotify profile + tokens
async function createFromSpotify(profile, tokens) {
  const spotifyEmail = profile.email || null;

  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null;

  const result = await pool.query(
    `INSERT INTO users (
        email,
        spotify_id,
        spotify_email,
        spotify_access_token,
        spotify_refresh_token,
        spotify_token_expires_at
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      spotifyEmail || `${profile.id}@spotify.local`, // fallback if Spotify hides email
      profile.id,
      spotifyEmail,
      tokens.access_token,
      tokens.refresh_token || null,
      expiresAt
    ]
  );

  return result.rows[0];
}

// Update Spotify tokens for an existing user
async function updateSpotifyTokens(userId, tokens) {
  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null;

  const result = await pool.query(
    `UPDATE users
     SET spotify_access_token = $1,
         spotify_refresh_token = $2,
         spotify_token_expires_at = $3
     WHERE id = $4
     RETURNING *`,
    [
      tokens.access_token,
      tokens.refresh_token || null,
      expiresAt,
      userId
    ]
  );

  return result.rows[0];
}

module.exports = {
  findById,
  findBySpotifyId,
  findByEmail,
  createFromSpotify,
  updateSpotifyTokens
};

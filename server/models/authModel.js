// server/models/userModel.js
const pool = require("./db");

// Create a new user
async function createUser(email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email`,
    [email, passwordHash]
  );

  return result.rows[0];
}

// Find user by email (for login)
async function findByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  findByEmail
};

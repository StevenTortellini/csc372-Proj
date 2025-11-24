const { Pool } = require("pg");
require("dotenv").config();

const isRailway = process.env.DATABASE_URL?.includes("rlwy.net");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRailway
    ? { rejectUnauthorized: false } // allow Railway cert chain
    : false
});

module.exports = pool;
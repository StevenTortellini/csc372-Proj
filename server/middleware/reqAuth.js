// server/middleware/reqAuth.js
const User = require("../models/userModel");

module.exports = async function requireAuth(req, res, next) {
  // Debug logs so you can see exactly what's happening
  console.log("[requireAuth] path:", req.path);
  console.log("[requireAuth] sessionID:", req.sessionID);
  console.log("[requireAuth] session.userId:", req.session && req.session.userId);

  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("[requireAuth] no user found for id", req.session.userId);
      return res.status(401).json({ error: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[requireAuth] error looking up user:", err);
    res.status(500).json({ error: "Auth check failed" });
  }
};

// server/controllers/authController.js
"use strict";
require("dotenv").config();
const fetch = require("node-fetch");
const querystring = require("querystring");
const User = require("../models/userModel");

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
  FRONTEND_URL
} = process.env;

const scopes =
  SPOTIFY_SCOPES ||
  "user-read-email user-read-private";

const frontendBase = FRONTEND_URL || "http://127.0.0.1:5173";

// STEP 1: redirect to Spotify
function spotifyLogin(req, res) {
  const state = Math.random().toString(36).substring(2);

  const params = querystring.stringify({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state
  });

  const authorizeURL = `https://accounts.spotify.com/authorize?${params}`;
  res.redirect(authorizeURL);
}

// STEP 2: callback with ?code=

async function spotifyCallback(req, res) {
  const { code, error } = req.query;

  if (error) {
    console.error("Spotify auth error:", error);
    return res.status(400).send("Spotify authorization failed.");
  }
  if (!code) {
    return res.status(400).send("Missing authorization code.");
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("Spotify token error:", tokenData);
      return res.status(500).send("Failed to obtain Spotify token.");
    }

    const { access_token } = tokenData;

    // Get profile
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const profile = await meRes.json();
    if (!meRes.ok) {
      console.error("Spotify /me error:", profile);
      return res.status(500).send("Failed to fetch Spotify profile.");
    }

    // Upsert user in DB
    let user = await User.findBySpotifyId(profile.id);
    if (!user) {
      user = await User.createFromSpotify(profile, tokenData);
    } else {
      user = await User.updateSpotifyTokens(user.id, tokenData);
    }

    // 🔐 Store session
    req.session.userId = user.id;
    console.log("Spotify callback: set req.session.userId =", req.session.userId);

    const redirectUrl = `${frontendBase}/moodboard`;

    // ✅ Ensure session is saved before redirecting
    req.session.save(err => {
      if (err) {
        console.error("Error saving session in Spotify callback:", err);
        return res.status(500).send("Failed to save session.");
      }
      console.log("Session saved; redirecting to", redirectUrl);
      return res.redirect(redirectUrl);
    });
  } catch (err) {
    console.error("Spotify callback error:", err);
    res.status(500).send("Spotify callback failed.");
  }
}


// who am I?
async function me(req, res) {
  console.log("GET /auth/me session =", req.session);

  if (!req.session || !req.session.userId) {
    console.log("GET /auth/me: no userId on session");
    return res.json({ user: null });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    console.log("GET /auth/me: no user found for id", req.session.userId);
    return res.json({ user: null });
  }

  console.log("GET /auth/me: returning user", user.id);

  res.json({
    user: {
      id: user.id,
      spotify_id: user.spotify_id,
      spotify_email: user.spotify_email,
      email: user.email,
      created_at: user.created_at
    }
  });
}


// logout
function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
}

module.exports = {
  spotifyLogin,
  spotifyCallback,
  me,
  logout
};

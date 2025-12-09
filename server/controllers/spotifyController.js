// server/controllers/spotifyController.js
"use strict";
require("dotenv").config();
const fetch = require("node-fetch");
const querystring = require("querystring");
const User = require("../models/userModel");

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

// Helper: refresh access token if needed
async function ensureFreshAccessToken(user) {
  const now = new Date();

  if (
    user.spotify_access_token &&
    user.spotify_token_expires_at &&
    new Date(user.spotify_token_expires_at) > now
  ) {
    return user.spotify_access_token;
  }

  if (!user.spotify_refresh_token) {
    throw new Error("No refresh token stored for this user.");
  }

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
      grant_type: "refresh_token",
      refresh_token: user.spotify_refresh_token
    })
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error("Spotify refresh error:", tokenData);
    throw new Error("Failed to refresh Spotify token.");
  }

  const tokens = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || user.spotify_refresh_token,
    expires_in: tokenData.expires_in
  };

  const updatedUser = await User.updateSpotifyTokens(user.id, tokens);
  return updatedUser.spotify_access_token;
}

// GET /api/spotify/search?q=...
async function search(req, res) {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing q parameter" });
  }

  try {
    const user = req.user;
    const accessToken = await ensureFreshAccessToken(user);

    const params = querystring.stringify({
      q,
      type: "track",
      limit: 12
    });

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await searchRes.json();

    if (!searchRes.ok) {
      console.error("Spotify search error:", data);
      return res.status(500).json({ error: "Spotify search failed" });
    }

    const tracks = (data.tracks?.items || []).map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      image: t.album.images?.[0]?.url || null,
      preview_url: t.preview_url
    }));

    res.json(tracks);
  } catch (err) {
    console.error("Spotify search exception:", err);
    res.status(500).json({ error: "Spotify search failed" });
  }
}

module.exports = {
  search
};

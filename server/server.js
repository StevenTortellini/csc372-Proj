"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");

const app = express();

// core middleware
app.use(multer().none());

app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
  origin: [
    
    "http://127.0.0.1:5173"
  ],
  credentials: true,
}));


app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  },
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const songRoutes = require("./routes/songRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");

app.use("/auth", authRoutes);
app.use("/playlists", playlistRoutes);
app.use("/songs", songRoutes);
app.use("/api/spotify", spotifyRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on port: " + PORT + "!");
});

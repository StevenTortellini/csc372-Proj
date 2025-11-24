// server/server.js
"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors"); 
require("dotenv").config();

const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


// Routes (MVC)
const playlistRoutes = require("./routes/playlistRoutes");
const songRoutes = require("./routes/songRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/playlists", playlistRoutes);
app.use("/songs", songRoutes);
app.use("/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on port: " + PORT + "!");
});

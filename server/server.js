// server/server.js
"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors"); 
require("dotenv").config();

const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(cors()); // if you don't need cross-origin in dev, you can remove
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/products", productRoutes);
app.use("/users", userRoutes);

// ---------- Serve React build in production (backend wraps frontend) ----------
/*
  If you’re using Vite, your build goes to: client/dist
  If CRA, it goes to: client/build

  This block lets Express serve the React UI when deployed.
  Keep it at the bottom so your API routes go first.
*/
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  // Don’t accidentally catch API routes
  if (req.path.startsWith("/products") || req.path.startsWith("/users")) {
    return res.status(404).json({ error: "Route not found" });
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on port: " + PORT + "!");
});

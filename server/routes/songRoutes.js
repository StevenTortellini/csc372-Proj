// server/routes/songRoutes.js
const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const requireAuth = require("../middleware/reqAuth");

router.post("/", requireAuth, songController.create);
router.get("/playlist/:playlistId", requireAuth, songController.getByPlaylist);
router.put("/:id", requireAuth, songController.update);
router.delete("/:id", requireAuth, songController.remove);

module.exports = router;

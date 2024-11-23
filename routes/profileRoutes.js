const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController"); // Pastikan impor dengan benar
const authenticateAdmin = require("../middleware/authMiddleware");
const router = express.Router();

// Route untuk mengambil profil admin
router.get("/", authenticateAdmin, getProfile);

// Route untuk memperbarui profil admin
router.put("/", authenticateAdmin, updateProfile);

module.exports = router;

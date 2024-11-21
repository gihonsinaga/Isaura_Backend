const express = require("express");
const router = express.Router();

// Contoh route untuk laporan
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Report API!" });
});

module.exports = router;

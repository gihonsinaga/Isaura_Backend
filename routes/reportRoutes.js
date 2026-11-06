const express = require("express");
const router = express.Router();
const {
  getAllReports,
  createReport,
  getReports,
} = require("../controllers/reportController");
const authenticateAdmin = require("../middleware/authMiddleware");

router.use(authenticateAdmin);

// Route untuk mendapatkan laporan berdasarkan bulan dan tahun
router.get("/", getAllReports);

// Route untuk menambahkan laporan
router.post("/", createReport);

router.get("/all", getReports);

module.exports = router;

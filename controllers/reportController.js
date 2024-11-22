const pool = require("../config/db");
const Report = require("../models/reportModel");

const getAllReports = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required" });
  }

  try {
    const reports = await Report.getAll(month, year);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReport = async (req, res) => {
  const { product_id, piece, month, year } = req.body;

  if (!product_id || !piece || !month || !year) {
    return res
      .status(400)
      .json({ error: "Product ID, piece, month, and year are required" });
  }

  try {
    // Ambil data produk berdasarkan ID
    const productQuery = `
      SELECT price, piece FROM products WHERE id = $1;
    `;
    const productResult = await pool.query(productQuery, [product_id]);
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.piece < piece) {
      return res.status(400).json({ error: "Insufficient stock available" });
    }

    // Hitung total harga untuk laporan
    const total_price = product.price * piece;

    // Kurangi jumlah piece di tabel products
    const updateProductQuery = `
      UPDATE products
      SET piece = piece - $1
      WHERE id = $2 RETURNING *;
    `;
    const updatedProductResult = await pool.query(updateProductQuery, [
      piece,
      product_id,
    ]);
    const updatedProduct = updatedProductResult.rows[0];

    // Tambahkan report berdasarkan bulan dan tahun
    const newReport = await Report.create({
      product_id,
      piece,
      total_price,
      month,
      year,
    });

    res.status(201).json({
      message: "Report added and stock updated successfully",
      report: newReport,
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReports,
  createReport,
};

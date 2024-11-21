const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Sesuaikan dengan file konfigurasi database Anda

// Get all products
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  const { product_name, category, price, piece, size, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (product_name, category, price, piece, size, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [product_name, category, price, piece, size, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { product_name, category, price, piece, size, image_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products 
       SET product_name = $1, category = $2, price = $3, piece = $4, size = $5, image_url = $6
       WHERE id = $7 RETURNING *`,
      [product_name, category, price, piece, size, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

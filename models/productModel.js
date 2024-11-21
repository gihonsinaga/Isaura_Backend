const pool = require("../config/db");

const Product = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  create: async ({ product_name, category, price, piece, size, image_url }) => {
    const result = await pool.query(
      `INSERT INTO products (product_name, category, price, piece, size, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [product_name, category, price, piece, size, image_url]
    );
    return result.rows[0];
  },

  update: async (
    id,
    { product_name, category, price, piece, size, image_url }
  ) => {
    const result = await pool.query(
      `UPDATE products 
       SET product_name = $1, category = $2, price = $3, piece = $4, size = $5, image_url = $6
       WHERE id = $7
       RETURNING *`,
      [product_name, category, price, piece, size, image_url, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rowCount;
  },
};

module.exports = Product;

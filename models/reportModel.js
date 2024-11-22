const pool = require("../config/db");

const Report = {
  getAll: async (month, year) => {
    const query = `
      SELECT 
        r.id,
        r.product_id,
        p.product_name,
        p.category,
        p.price,
        r.piece,
        r.total_price,
        r.created_at
      FROM reports r
      JOIN products p ON r.product_id = p.id
      WHERE EXTRACT(MONTH FROM r.created_at) = $1
        AND EXTRACT(YEAR FROM r.created_at) = $2
      ORDER BY r.created_at DESC;
    `;
    const values = [month, year];
    const result = await pool.query(query, values);
    return result.rows;
  },

  create: async ({ product_id, piece, total_price, month, year }) => {
    const query = `
      INSERT INTO reports (product_id, piece, total_price, created_at)
      VALUES ($1, $2, $3, TO_TIMESTAMP($4 || '-' || $5 || '-01', 'YYYY-MM-DD'))
      RETURNING *;
    `;
    const values = [product_id, piece, total_price, year, month];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
};

module.exports = Report;

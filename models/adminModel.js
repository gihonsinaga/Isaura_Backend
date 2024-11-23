const pool = require("../config/db");

const Admin = {
  // Fungsi untuk mendapatkan data admin berdasarkan ID
  findById: async (id) => {
    const query =
      "SELECT id, username, email, phone, address FROM admins WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Mengembalikan data admin
  },

  // Fungsi untuk memperbarui profil admin berdasarkan ID
  updateById: async (id, updatedData) => {
    const { username, email, phone, address } = updatedData;
    const query = `
      UPDATE admins 
      SET username = $1, email = $2, phone = $3, address = $4 
      WHERE id = $5 RETURNING id, username, email, phone, address
    `;
    const result = await pool.query(query, [
      username,
      email, // Email tetap
      phone,
      address,
      id,
    ]);
    return result.rows[0];
  },
};

module.exports = Admin;

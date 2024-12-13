const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || null, // Gunakan DATABASE_URL jika ada
  user: process.env.DB_USER || undefined, // Fallback ke variabel terpisah
  host: process.env.DB_HOST || undefined,
  database: process.env.DB_NAME || undefined,
  password: process.env.DB_PASS || undefined,
  port: process.env.DB_PORT || undefined,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined, // Hanya untuk production
});

module.exports = pool;

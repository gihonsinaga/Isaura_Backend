const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const required = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASS",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];
for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`${name} must be set`);
  }
}

async function initialize() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      product_name VARCHAR(255),
      category VARCHAR(100),
      price DECIMAL(10, 2),
      piece INTEGER,
      size VARCHAR(10),
      image_url TEXT
    );
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      piece INTEGER,
      total_price DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const existing = await pool.query(
    "SELECT id FROM admins WHERE email = $1",
    [process.env.ADMIN_EMAIL]
  );
  if (existing.rowCount === 0) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await pool.query(
      "INSERT INTO admins (username, email, password) VALUES ($1, $2, $3)",
      [process.env.ADMIN_USERNAME || "admin", process.env.ADMIN_EMAIL, password]
    );
    console.log("Created the initial Isaura administrator.");
  }
}

initialize()
  .finally(() => pool.end())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const bcrypt = require("bcrypt");

const password = "password123"; // Password yang ingin Anda gunakan
const saltRounds = 10; // Jumlah salt yang digunakan untuk hashing

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hashedPassword); // Hasil hash password
  }
});

const bcrypt = require("bcryptjs");

const password = "password123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hashedPassword); // Hasil hash password
  }
});

//npx nodemon index.js

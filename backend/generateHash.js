const bcrypt = require("bcryptjs");

const password = "admin123";   // change this to any password you want

async function generateHash() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log("Plain Password:", password);
  console.log("Hashed Password:", hash);
}

generateHash();
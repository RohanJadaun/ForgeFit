const jwt = require("jsonwebtoken");

const generateToken = (id, remember = true) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: remember ? "7d" : "1d",
    }
  );
};

module.exports = generateToken;

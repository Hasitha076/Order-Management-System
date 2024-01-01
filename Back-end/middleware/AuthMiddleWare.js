const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers.autherization;

  if (!token) {
    return res.status(403).json({ error: "Token is missing!" });
  }

  jwt.verify(token, secretKey, (err, encoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid Token!" });
    }
    next();
  });
};

module.exports = verifyToken;

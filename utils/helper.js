const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) =>
  jwt.sign({ user: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId) =>
  jwt.sign({ user: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
};

const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ status: "error", msg: "Server error" });
};

const isOwner = (todo, userId) => todo.userId.toString() === userId;
module.exports = { generateAccessToken,generateRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie, handleServerError,isOwner };
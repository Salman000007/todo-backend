const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  handleServerError,
} = require("../utils/helper");

// Signup
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ status: "fail", msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const newUser = await new User({ email, password: hashedPassword }).save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({ status: "success", accessToken });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res
        .status(400)
        .json({ status: "fail", msg: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({ status: "success", accessToken });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Logout
const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res
      .status(401)
      .json({ status: "fail", msg: "No refresh token provided" });

  try {
    const decoded = jwt.decode(token);
    await TokenBlacklist.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });
    clearRefreshTokenCookie(res);

    return res
      .status(200)
      .json({ status: "success", msg: "Logged out successfully" });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res
      .status(401)
      .json({ status: "fail", msg: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted)
      return res
        .status(403)
        .json({ status: "fail", msg: "Refresh token is blacklisted" });

    const newAccessToken = generateAccessToken(decoded.user);
    return res
      .status(200)
      .json({ status: "success", accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res
      .status(403)
      .json({ status: "fail", msg: "Invalid or expired refresh token" });
  }
};

module.exports = { signup, login, logout, refreshToken };

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "internhub_super_secret_jwt_key_2026";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@internhub.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPassword123!";

// In-memory users store for development fallback
const inMemoryUsers = [
  {
    _id: "65f000000000000000000099",
    name: "Platform Admin",
    email: ADMIN_EMAIL,
    // Pre-hashed bcrypt for default admin password: AdminPassword123!
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];

// Helper to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new applicant/user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields: name, email, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: "user",
      });

      const token = generateToken({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });

      return res.status(201).json({
        message: "Account created successfully",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // In-memory fallback
    const existing = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    inMemoryUsers.push(newUser);

    const token = generateToken({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// @desc    Login user or admin
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Direct check against configured default Admin credentials
    if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({
        id: "admin-master-id",
        name: "Platform Administrator",
        email: ADMIN_EMAIL,
        role: "admin",
        isEnvAdmin: true,
      });

      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: "admin-master-id",
          name: "Platform Administrator",
          email: ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // In-memory fallback
    const memUser = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (!memUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMemMatch = bcrypt.compareSync(password, memUser.passwordHash);
    if (!isMemMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      role: memUser.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};

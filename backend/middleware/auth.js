const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "internhub_super_secret_jwt_key_2026";

// Verify Bearer JWT Token
const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Authentication token is missing.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // If MongoDB is connected, optionally fetch fresh user record
    if (mongoose.connection.readyState === 1 && decoded.id && !decoded.isEnvAdmin) {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User account no longer exists." });
      }
      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } else {
      // In-memory or pre-decoded payload
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

// Require Admin Role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access forbidden. Administrator privileges are required.",
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
};

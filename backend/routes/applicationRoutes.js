const express = require("express");
const router = express.Router();
const {
  submitApplication,
  getApplications,
} = require("../controllers/applicationController");
const upload = require("../middleware/upload");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// Optional auth helper to attach user if token present on submit
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const jwt = require("jsonwebtoken");
      const secret = process.env.JWT_SECRET || "internhub_super_secret_jwt_key_2026";
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
    } catch {
      // Ignore invalid token and continue as guest
    }
  }
  next();
};

// POST /api/applications - Accepts multipart/form-data with "resume" file
router.post("/", optionalAuth, upload.single("resume"), submitApplication);

// GET /api/applications - Admin only
router.get("/", verifyToken, requireAdmin, getApplications);

module.exports = router;

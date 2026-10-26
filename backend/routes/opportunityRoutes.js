const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// /api/opportunities
router
  .route("/")
  .get(getOpportunities)
  .post(verifyToken, requireAdmin, createOpportunity);

// /api/opportunities/:id
router
  .route("/:id")
  .get(getOpportunityById)
  .put(verifyToken, requireAdmin, updateOpportunity)
  .delete(verifyToken, requireAdmin, deleteOpportunity);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");

// /api/opportunities
router.route("/").get(getOpportunities).post(createOpportunity);

// /api/opportunities/:id
router
  .route("/:id")
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;

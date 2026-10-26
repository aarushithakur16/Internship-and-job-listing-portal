const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");

// @desc    Get all opportunities with optional search & domain filter
// @route   GET /api/opportunities
const getOpportunities = async (req, res) => {
  try {
    const { search, domain } = req.query;
    let query = {};

    // Filter by domain if provided (case-insensitive exact match)
    if (domain && domain.trim() !== "") {
      query.domain = { $regex: new RegExp(`^${domain.trim()}$`, "i") };
    }

    // Search keyword in title, companyName, or description
    if (search && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { description: searchRegex },
      ];
    }

    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
    return res.status(200).json(opportunities);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid opportunity ID format" });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    return res.status(200).json(opportunity);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new opportunity
// @route   POST /api/opportunities
const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      companyName,
      domain,
      location,
      experience,
      description,
      applicationLink,
    } = req.body;

    // Check required fields
    if (
      !title ||
      !companyName ||
      !domain ||
      !location ||
      !experience ||
      !description ||
      !applicationLink
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: title, companyName, domain, location, experience, description, applicationLink",
      });
    }

    const newOpportunity = await Opportunity.create({
      title,
      companyName,
      domain,
      location,
      experience,
      description,
      applicationLink,
    });

    return res.status(201).json(newOpportunity);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update opportunity by ID
// @route   PUT /api/opportunities/:id
const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid opportunity ID format" });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    return res.status(200).json(updatedOpportunity);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete opportunity by ID
// @route   DELETE /api/opportunities/:id
const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid opportunity ID format" });
    }

    const deletedOpportunity = await Opportunity.findByIdAndDelete(id);

    if (!deletedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    return res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};

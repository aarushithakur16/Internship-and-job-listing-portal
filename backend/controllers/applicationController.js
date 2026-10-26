const mongoose = require("mongoose");
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

// @desc    Submit a new application
// @route   POST /api/applications
const submitApplication = async (req, res) => {
  try {
    const { opportunityId, applicantName, email, phone, resumeLink } = req.body;

    // Validate required fields
    if (!opportunityId || !applicantName || !email || !phone) {
      return res.status(400).json({
        message:
          "Please provide all required fields: opportunityId, applicantName, email, phone",
      });
    }

    // Validate opportunityId format
    if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({ message: "Invalid opportunity ID format" });
    }

    // Check if the opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Save the application
    const application = await Application.create({
      opportunityId,
      applicantName,
      email,
      phone,
      resumeLink: resumeLink ? resumeLink.trim() : "",
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all applications with linked opportunity populated
// @route   GET /api/applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("opportunityId", "title companyName")
      .sort({ submittedAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
};

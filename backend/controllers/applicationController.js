const mongoose = require("mongoose");
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const { sampleOpportunities } = require("../seed");

// In-memory applications store
const inMemoryApplications = [];

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

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Validate opportunityId format
      if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
        return res.status(400).json({ message: "Invalid opportunity ID format" });
      }

      // Check if the opportunity exists
      const opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      // Save the application to MongoDB
      const application = await Application.create({
        opportunityId,
        applicantName: applicantName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        resumeLink: resumeLink ? resumeLink.trim() : "",
      });

      return res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    }

    // In-memory fallback mode
    const opportunity = sampleOpportunities.find(
      (opp) => opp._id === opportunityId || String(opp.id) === opportunityId
    );

    const newApp = {
      _id: new mongoose.Types.ObjectId().toString(),
      opportunityId,
      applicantName: applicantName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      resumeLink: resumeLink ? resumeLink.trim() : "",
      submittedAt: new Date().toISOString(),
      opportunityTitle: opportunity ? opportunity.title : "Application Submission",
      companyName: opportunity ? opportunity.companyName : "Partner Company",
    };

    inMemoryApplications.unshift(newApp);

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApp,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all applications with linked opportunity populated
// @route   GET /api/applications
const getApplications = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const applications = await Application.find()
        .populate("opportunityId", "title companyName")
        .sort({ submittedAt: -1 });

      return res.status(200).json(applications);
    }

    // In-memory fallback
    return res.status(200).json(inMemoryApplications);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitApplication,
  getApplications,
};

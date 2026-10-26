const mongoose = require("mongoose");
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const { sampleOpportunities } = require("../seed");
const { sendApplicationEmail } = require("../utils/sendEmail");

// In-memory applications store
const inMemoryApplications = [];

// @desc    Submit a new application (supports multipart/form-data with resume file)
// @route   POST /api/applications
const submitApplication = async (req, res) => {
  try {
    const { opportunityId, applicantName, email, phone } = req.body;
    let resumeLink = req.body.resumeLink ? req.body.resumeLink.trim() : "";
    let resumeFilePath = "";
    let resumeOriginalName = "";

    // If multer handled an uploaded resume file
    if (req.file) {
      resumeFilePath = req.file.path;
      resumeOriginalName = req.file.originalname;
      // Statically servable link
      resumeLink = `/uploads/${req.file.filename}`;
    }

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

    const userId = req.user ? req.user.id : null;
    const isMongoConnected = mongoose.connection.readyState === 1;

    let opportunityTitle = "Opportunity";
    let companyName = "Company";

    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
        return res.status(400).json({ message: "Invalid opportunity ID format" });
      }

      const opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      opportunityTitle = opportunity.title;
      companyName = opportunity.companyName;

      const application = await Application.create({
        opportunityId,
        userId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
        applicantName: applicantName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        resumeLink,
        resumeFilePath,
        resumeOriginalName,
      });

      // Send email notification in background (non-blocking)
      sendApplicationEmail({
        to: email.trim().toLowerCase(),
        applicantName: applicantName.trim(),
        opportunityTitle,
        companyName,
      }).catch(() => {});

      return res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    }

    // In-memory fallback mode
    const opportunity = sampleOpportunities.find(
      (opp) => opp._id === opportunityId || String(opp.id) === opportunityId
    );

    if (opportunity) {
      opportunityTitle = opportunity.title;
      companyName = opportunity.companyName;
    }

    const newApp = {
      _id: new mongoose.Types.ObjectId().toString(),
      opportunityId,
      userId,
      applicantName: applicantName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      resumeLink,
      resumeFilePath,
      resumeOriginalName,
      submittedAt: new Date().toISOString(),
      opportunityTitle,
      companyName,
    };

    inMemoryApplications.unshift(newApp);

    // Send email notification in background
    sendApplicationEmail({
      to: email.trim().toLowerCase(),
      applicantName: applicantName.trim(),
      opportunityTitle,
      companyName,
    }).catch(() => {});

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApp,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all applications with linked opportunity populated (Admin only)
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

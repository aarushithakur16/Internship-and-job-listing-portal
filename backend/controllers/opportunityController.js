const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");
const { sampleOpportunities } = require("../seed");

// In-memory fallback store initialized with seeded opportunities
let inMemoryOpportunities = sampleOpportunities.map((opp, idx) => ({
  ...opp,
  _id: opp._id || `65f00000000000000000000${idx + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// Helper to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// @desc    Get all opportunities with optional search & domain filter
// @route   GET /api/opportunities
const getOpportunities = async (req, res) => {
  try {
    const { search, domain } = req.query;
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      let query = {};

      // Filter by domain if provided (case-insensitive, ignore "all")
      if (domain && domain.trim() !== "" && domain.trim().toLowerCase() !== "all") {
        query.domain = { $regex: new RegExp(`^${escapeRegex(domain.trim())}$`, "i") };
      }

      // Search keyword in title, companyName, description, location, or experience
      if (search && search.trim() !== "") {
        const searchRegex = { $regex: escapeRegex(search.trim()), $options: "i" };
        query.$or = [
          { title: searchRegex },
          { companyName: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { domain: searchRegex },
          { experience: searchRegex },
        ];
      }

      const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
      return res.status(200).json(opportunities);
    }

    // In-memory fallback mode
    let results = [...inMemoryOpportunities];

    // Filter by domain
    if (domain && domain.trim() !== "" && domain.trim().toLowerCase() !== "all") {
      const targetDomain = domain.trim().toLowerCase();
      results = results.filter(
        (item) => item.domain && item.domain.toLowerCase() === targetDomain
      );
    }

    // Filter by search keyword
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      results = results.filter((item) => {
        return (
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.companyName && item.companyName.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          (item.domain && item.domain.toLowerCase().includes(q)) ||
          (item.experience && item.experience.toLowerCase().includes(q))
        );
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      return res.status(400).json({ message: "Opportunity ID is required" });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid opportunity ID format" });
      }

      const opportunity = await Opportunity.findById(id);

      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      return res.status(200).json(opportunity);
    }

    // In-memory fallback mode
    const opportunity = inMemoryOpportunities.find(
      (item) => item._id === id || String(item.id) === id
    );

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

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
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
    }

    // In-memory fallback
    const newOpportunity = {
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      companyName,
      domain,
      location,
      experience,
      description,
      applicationLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryOpportunities.unshift(newOpportunity);
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
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
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
    }

    const index = inMemoryOpportunities.findIndex(
      (item) => item._id === id || String(item.id) === id
    );

    if (index === -1) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    inMemoryOpportunities[index] = {
      ...inMemoryOpportunities[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json(inMemoryOpportunities[index]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete opportunity by ID
// @route   DELETE /api/opportunities/:id
const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid opportunity ID format" });
      }

      const deletedOpportunity = await Opportunity.findByIdAndDelete(id);

      if (!deletedOpportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      return res.status(200).json({ message: "Opportunity deleted successfully" });
    }

    const index = inMemoryOpportunities.findIndex(
      (item) => item._id === id || String(item.id) === id
    );

    if (index === -1) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    inMemoryOpportunities.splice(index, 1);
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

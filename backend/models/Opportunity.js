const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    applicationLink: {
      type: String,
      required: [true, "Application link is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;

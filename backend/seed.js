const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Opportunity = require("./models/Opportunity");

dotenv.config();

const sampleOpportunities = [
  {
    title: "Frontend Developer Intern",
    companyName: "PixelCraft Studios",
    domain: "Web Development",
    location: "Remote",
    experience: "Fresher",
    description:
      "Build interactive user interfaces with React.js, HTML, and CSS. Collaborate with the design team on UI/UX mockups.",
    applicationLink:
      "https://pixelcraft.example.com/careers/frontend-intern",
  },
  {
    title: "Backend Engineer Intern",
    companyName: "CloudScale Systems",
    domain: "Web Development",
    location: "Bangalore, India",
    experience: "0-1 years",
    description:
      "Work on Node.js, Express, and MongoDB REST APIs. Optimize database queries and assist in server architecture.",
    applicationLink:
      "https://cloudscale.example.com/apply/backend-intern",
  },
  {
    title: "Data Science Intern",
    companyName: "InsightAI Labs",
    domain: "Data Science",
    location: "Remote",
    experience: "Fresher",
    description:
      "Assist in data cleaning, exploratory data analysis, and building machine learning models using Python and Pandas.",
    applicationLink: "https://insightai.example.com/jobs/ds-intern",
  },
  {
    title: "UI/UX Designer",
    companyName: "Aura Creative",
    domain: "Design",
    location: "New York, NY",
    experience: "1-2 years",
    description:
      "Design wireframes, prototypes, and high-fidelity mockups using Figma. Conduct user research and usability testing.",
    applicationLink: "https://auracreative.example.com/careers/uiux",
  },
  {
    title: "Digital Marketing Specialist",
    companyName: "GrowthWave Media",
    domain: "Marketing",
    location: "Remote",
    experience: "Fresher",
    description:
      "Manage social media campaigns, SEO content optimization, and performance tracking across digital advertising channels.",
    applicationLink: "https://growthwave.example.com/apply/marketing",
  },
  {
    title: "Cloud & DevOps Intern",
    companyName: "SkyOps Tech",
    domain: "Cloud Computing",
    location: "San Francisco, CA",
    experience: "0-1 years",
    description:
      "Gain hands-on experience with Docker, CI/CD pipelines, and AWS cloud deployment automation.",
    applicationLink: "https://skyops.example.com/careers/devops-intern",
  },
];

const seedDatabase = async () => {
  try {
    if (
      !process.env.MONGO_URI ||
      process.env.MONGO_URI.includes("your_mongodb_connection_string_here")
    ) {
      console.error(
        "Error: Please set a valid MONGO_URI in server/.env before seeding."
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing opportunities to avoid duplication
    await Opportunity.deleteMany();
    console.log("Cleared existing opportunities.");

    // Insert sample data
    const created = await Opportunity.insertMany(sampleOpportunities);
    console.log(`Successfully seeded ${created.length} sample opportunities!`);

    await mongoose.disconnect();
    console.log("Database connection closed. Seeding finished.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();

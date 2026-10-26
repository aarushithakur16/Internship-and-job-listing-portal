const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Opportunity = require("./models/Opportunity");

dotenv.config();

const sampleOpportunities = [
  {
    _id: "65f000000000000000000001",
    title: "Frontend Developer Intern",
    companyName: "PixelCraft Studios",
    domain: "Web Development",
    location: "Remote",
    experience: "Fresher",
    description:
      "Build interactive user interfaces with React.js, HTML, and CSS. Collaborate with the design team on UI/UX mockups and translate wireframes into pixel-perfect components.",
    applicationLink: "https://pixelcraft.example.com/careers/frontend-intern",
  },
  {
    _id: "65f000000000000000000002",
    title: "Backend Engineer Intern",
    companyName: "CloudScale Systems",
    domain: "Web Development",
    location: "Bangalore, India",
    experience: "0-1 years",
    description:
      "Work on Node.js, Express, and MongoDB REST APIs. Optimize database queries, build resilient endpoints, and assist in cloud server architecture.",
    applicationLink: "https://cloudscale.example.com/apply/backend-intern",
  },
  {
    _id: "65f000000000000000000003",
    title: "Data Science Intern",
    companyName: "InsightAI Labs",
    domain: "Data Science",
    location: "Remote",
    experience: "Fresher",
    description:
      "Assist in data cleaning, exploratory data analysis, and building machine learning models using Python, Pandas, and Scikit-learn.",
    applicationLink: "https://insightai.example.com/jobs/ds-intern",
  },
  {
    _id: "65f000000000000000000004",
    title: "UI/UX Designer",
    companyName: "Aura Creative",
    domain: "Design",
    location: "New York, NY",
    experience: "1-2 years",
    description:
      "Design wireframes, prototypes, and high-fidelity mockups using Figma. Conduct user research, usability testing, and maintain design systems.",
    applicationLink: "https://auracreative.example.com/careers/uiux",
  },
  {
    _id: "65f00000000000000000005",
    title: "Digital Marketing Specialist",
    companyName: "GrowthWave Media",
    domain: "Marketing",
    location: "Remote",
    experience: "Fresher",
    description:
      "Manage social media campaigns, SEO content optimization, email newsletters, and performance tracking across digital advertising channels.",
    applicationLink: "https://growthwave.example.com/apply/marketing",
  },
  {
    _id: "65f00000000000000000006",
    title: "Cloud & DevOps Intern",
    companyName: "SkyOps Tech",
    domain: "Cloud Computing",
    location: "San Francisco, CA",
    experience: "0-1 years",
    description:
      "Gain hands-on experience with Docker containers, CI/CD pipelines, Kubernetes, and AWS cloud deployment automation.",
    applicationLink: "https://skyops.example.com/careers/devops-intern",
  },
  {
    _id: "65f000000000000000000007",
    title: "Full Stack Engineer Intern",
    companyName: "DevNova Systems",
    domain: "Web Development",
    location: "Hyderabad, India",
    experience: "Fresher",
    description:
      "Develop full-stack web features using React on the frontend and Node/Express on the backend, integrated with MongoDB data models.",
    applicationLink: "https://devnova.example.com/join/fullstack-intern",
  },
  {
    _id: "65f000000000000000000008",
    title: "Associate Product Manager Intern",
    companyName: "Elevate Commerce",
    domain: "Product Management",
    location: "Remote",
    experience: "Fresher / Final Year",
    description:
      "Collaborate with design and engineering teams to research user pain points, define product roadmaps, and ship high-impact features.",
    applicationLink: "https://elevatecommerce.example.com/apm-program",
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI && !process.env.MONGO_URI.includes("your_mongodb_connection_string_here")
        ? process.env.MONGO_URI
        : "mongodb://127.0.0.1:27017/internship_portal";

    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
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
    console.warn("Could not seed external MongoDB:", error.message);
    console.log("Built-in in-memory fallback will automatically provide seeded opportunities.");
    process.exit(0);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleOpportunities };

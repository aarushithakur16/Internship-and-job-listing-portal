const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// CORS configuration to allow requests from any frontend port (e.g. Vite on 5173)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "InternHub API is running", status: "ok" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

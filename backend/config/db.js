const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI && !process.env.MONGO_URI.includes("your_mongodb_connection_string_here")
      ? process.env.MONGO_URI
      : "mongodb://127.0.0.1:27017/internship_portal";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[DB] Connected to MongoDB host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[DB] Notice: MongoDB not connected (${error.message}).`);
    console.log("[DB] Using built-in seeded storage mode for development.");
  }
};

module.exports = connectDB;

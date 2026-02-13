const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is undefined. Check your .env file.");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

  } catch (error) {

    console.error("MongoDB connection error:", error.message);

    process.exit(1);

  }
};

module.exports = connectDB;

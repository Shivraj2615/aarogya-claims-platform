const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "John Patient",
        email: "patient@example.com",
        password: hashedPassword,
        role: "patient",
      },
      {
        name: "Jane Insurer",
        email: "insurer@example.com",
        password: hashedPassword,
        role: "insurer",
      },
    ];

    await User.insertMany(users);

    console.log("Seed users created successfully");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  }
};

seedUsers();

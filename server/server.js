const express = require("express");
const app = express();

const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/claims", claimRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, () => {
  console.log("Aarogya API is running");
});

const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const { login, register } = require("../controllers/authController");

const User = require("../models/User");

router.post("/login", login);
router.post("/register", register);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;

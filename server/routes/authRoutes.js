const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const { login } = require("../controllers/authController");

router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;

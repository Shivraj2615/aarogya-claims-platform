const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const upload = require("../config/upload");

const {
  createClaim,
  getMyClaims,
  getAllClaims,
  getClaimById,
  updateClaim,
} = require("../controllers/claimController");

router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  upload.single("document"),
  createClaim,
);
router.get("/my", protect, authorizeRoles("patient"), getMyClaims);
router.get("/", protect, authorizeRoles("insurer"), getAllClaims);
router.get("/:id", protect, authorizeRoles("patient", "insurer"), getClaimById);
router.patch("/:id", protect, authorizeRoles("insurer"), updateClaim);

module.exports = router;

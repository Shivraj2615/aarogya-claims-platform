const Claim = require("../models/Claim");
const User = require("../models/User");

module.exports.createClaim = async (req, res) => {
  try {
    const { claimAmount, description } = req.body;

    if (!claimAmount || !description) {
      return res.status(400).json({
        message: "Claim amount and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Supporting document is required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const claim = await Claim.create({
      patientId: user._id,
      name: user.name,
      email: user.email,
      claimAmount,
      description,
      documentUrl: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    console.error("Create claim error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      patientId: req.user.userId,
    }).sort({ submissionDate: -1 });

    res.json({
      claims,
    });
  } catch (error) {
    console.error("Get my claims error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("patientId", "name email")
      .sort({ submissionDate: -1 });

    res.json({
      claims,
    });
  } catch (error) {
    console.error("Get all claims error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports.getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate(
      "patientId",
      "name email",
    );

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    if (
      req.user.role === "patient" &&
      claim.patientId._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json({
      claim,
    });
  } catch (error) {
    console.error("Get claim error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports.updateClaim = async (req, res) => {
  try {
    const { status, approvedAmount, insurerComments } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    if (status !== undefined) {
      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      claim.status = status;
    }

    if (approvedAmount !== undefined) {
      if (approvedAmount < 0 || approvedAmount > claim.claimAmount) {
        return res.status(400).json({
          message: "Invalid approved amount",
        });
      }

      claim.approvedAmount = approvedAmount;
    }

    if (insurerComments !== undefined) {
      claim.insurerComments = insurerComments;
    }

    await claim.save();

    res.json({
      message: "Claim updated successfully",
      claim,
    });
  } catch (error) {
    console.error("Update claim error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

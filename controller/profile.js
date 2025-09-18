const User = require("../models/userModel");

const { validateUpdateProfileBody } = require("../utils/validate");

const viewProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "user fetched successfully",
      user: user,
    });
  } catch (err) {
    return res.staus(400).json({
      message: "something went wrong",
      error: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!validateUpdateProfileBody(req.body)) {
      return res.status(400).json({
        message: "enter valid details",
      });
    }

    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "user updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = { viewProfile, updateProfile };

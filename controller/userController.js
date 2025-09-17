const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, skills, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        message: `user with email: ${email} already exist`,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills,
    });
    await user.save();

    res.status(201).send({
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const findAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send({
        message: "user not found",
      });
    }
    res.status(200).send({
      data: users,
    });
  } catch (err) {
    res.status(500).send({
      message: "internal server error",
    });
  }
};

const findUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        data: "user not found",
      });
    }
    res.status(200).send({
      message: "user fetched successfully",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "internal server error",
    });
  }
};

const updateSkills = async (req, res, next) => {
  try {
    const userId = req.params?.userId;
    const { skills } = req.body;
    const uniqueSkills = [...new Set(skills)];

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { skills: { $each: uniqueSkills } },
      },
      { new: true, runValidators: true }
    );
    await user.validate();
    res.status(200).send({
      message: "skills update successfully",
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSkills = async (req, res, next) => {
  try {
    const userId = req.params?.userId;
    const { skills } = req.body;
    const uniqueSkills = [...new Set(skills)];

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { skills: { $in: uniqueSkills } },
      },
      { new: true }
    );

    res.status(200).send({
      message: "skills update successfully",
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("enter an valid email and password");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("enter an valid email and password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("enter an valid email and password");
    }

    // lets send an token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      // sameSite: "none",
    });
    res.status(200).json({
      message: "user fetched successfully",
      user: { user, token },
    });
  } catch (err) {
    res.status(400).json({
      message: "something went wrong",
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
  findAllUser,
  findUser,
  updateSkills,
  deleteSkills,
  loginUser,
};

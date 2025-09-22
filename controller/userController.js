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

const loginUser = async (req, res) => {
  try {
    console.log("ip", req.ip);
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

const logOut = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expiresIn: Date.now(),
  }),
    res.status(200).json({
      message: "user logged out successfully",
    });
};

const getUser = async (req, res) => {
  res.status(200).json({
    message: "user fetched successfully",
    user: req.user,
  });
};

module.exports = {
  createUser,
  loginUser,
  logOut,
  getUser,
};

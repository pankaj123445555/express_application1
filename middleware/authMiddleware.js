const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "invalid request",
    });
  }
};

module.exports = authMiddleWare;

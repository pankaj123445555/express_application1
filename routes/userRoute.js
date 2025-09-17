const express = require("express");

const router = express.Router();

const authMiddleWare = require("../middleware/authMiddleware");

const {
  createUser,
  loginUser,
  logOut,
  getUser,
} = require("../controller/userController");

// RESTful API endpoints
router.post("/sign-up", createUser);
router.post("/login", loginUser);
router.post("/logout", logOut);
router.get("/get-user", authMiddleWare, getUser);

module.exports = router;

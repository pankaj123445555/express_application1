const express = require("express");

const router = express.Router();

const authMiddleWare = require("../middleware/authMiddleware");

const {
  createUser,
  findAllUser,
  findUser,
  updateSkills,
  deleteSkills,
  loginUser,
} = require("../controller/userController");

// RESTful API endpoints
router.post("/sign-up", createUser);
router.get("/", findAllUser);
router.get("/:userId", authMiddleWare, findUser);
router.post("/login", loginUser);
router.post("/add-skills/:userId", updateSkills);
router.delete("/delete-skills/:userId", deleteSkills);

module.exports = router;

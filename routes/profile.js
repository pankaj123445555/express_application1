const express = require("express");

const router = express.Router();

const { viewProfile, updateProfile } = require("../controller/profile");
const { authMiddleWare } = require("../middleware/authMiddleware");
const { route } = require("./userRoute");

router.get("/profile/:userId", authMiddleWare, viewProfile);
router.patch("/profile", authMiddleWare, updateProfile);

module.exports = router;

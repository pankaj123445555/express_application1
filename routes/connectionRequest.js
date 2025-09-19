const express = require("express");

const router = express.Router();

const { sendConnectionRequest } = require("../controller/connectionRequest");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post(
  "/send/connection-request/:status/:userId",
  authMiddleWare,
  sendConnectionRequest
);

module.exports = router;

const express = require("express");

const router = express.Router();

const {
  sendConnectionRequest,
  reviewRequest,
} = require("../controller/connectionRequest");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post(
  "/send/connection-request/:status/:userId",
  authMiddleWare,
  sendConnectionRequest
);

router.post(
  "/review/connection-request/:status/:reqId",
  authMiddleWare,
  reviewRequest
);

module.exports = router;

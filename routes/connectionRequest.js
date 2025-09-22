const express = require("express");

const router = express.Router();

const {
  sendConnectionRequest,
  reviewRequest,
  reviewConnection,
  allConnections,
  connectionFeed,
} = require("../controller/connectionRequest");
const { authMiddleWare } = require("../middleware/authMiddleware");
const { route } = require("./userRoute");

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

router.get("/review/connection-request", authMiddleWare, reviewConnection);
router.get("/review/connections", authMiddleWare, allConnections);

router.get("/connection-feed", authMiddleWare, connectionFeed);

module.exports = router;

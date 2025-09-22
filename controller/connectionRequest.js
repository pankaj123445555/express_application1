const { stat } = require("fs");
const connectionModel = require("../models/coonectionRequest");
const User = require("../models/userModel");

const sendConnectionRequest = async (req, res) => {
  try {
    const toUserId = req.params.userId;
    const status = req.params.status;
    console.log(toUserId, status);
    const allowedStatus = ["interested", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "please send an valid status",
      });
    }

    const isConnectionAlreadyExist = await connectionModel.findOne({
      $or: [
        { fromUserId: req.user._id, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: req.user._id },
      ],
    });

    if (isConnectionAlreadyExist) {
      return res.status(400).json({
        message: "request already sent",
      });
    }
    // now add an connection request to database

    const ConnectionRequest = new connectionModel({
      fromUserId: req.user._id,
      toUserId: toUserId,
      status,
    });

    const data = await ConnectionRequest.save();

    return res.status(200).json({
      message: "connection request send successfully",
      data: data,
    });
  } catch (err) {
    return res.status(400).json({
      message: "some thing went wrong",
      error: err.message,
    });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, reqId } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `status is not allowed : ${status}`,
      });
    }
    console.log(reqId, loggedInUser._id);
    const isRequestExist = await connectionModel.findOne({
      _id: reqId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!isRequestExist) {
      return res.status(400).json({
        message: "invalid request",
      });
    }
    isRequestExist.status = status;
    const data = await isRequestExist.save();
    return res.status(200).json({
      message: `request - ${status}`,
      data: data,
    });
  } catch (err) {
    return res.status(400).json({
      message: "some thing went wrong",
      err: err.message,
    });
  }
};

const reviewConnection = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    return res.status(200).json({
      message: "data fetched successfully",
      data: requests,
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      err: error.message,
    });
  }
};

const allConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const myConnections = await connectionModel
      .find({
        status: "accepted",
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      })
      .populate("fromUserId")
      .populate("toUserId");

    return res.status(200).json({
      message: "here is my all connection",
      data: myConnections.map((item) => {
        if (item.fromUserId._id.equals(loggedInUser._id)) {
          return item.toUserId;
        }
        return item.fromUserId;
      }),
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

const connectionFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allRequests = await connectionModel
      .find({
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    console.log(allRequests);

    const hideUser = new Set();

    allRequests.forEach((item) => {
      hideUser.add(item.fromUserId.toString());
      hideUser.add(item.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUser) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName lastName profilePic");

    return res.status(200).json({
      message: "here is my all connection",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  sendConnectionRequest,
  reviewRequest,
  reviewConnection,
  allConnections,
  connectionFeed,
};

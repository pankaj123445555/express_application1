const { stat } = require("fs");
const connectionModel = require("../models/coonectionRequest");

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

module.exports = { sendConnectionRequest, reviewRequest };

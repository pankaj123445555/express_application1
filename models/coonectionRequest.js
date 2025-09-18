const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromuserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "from user id is required"],
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "to user id is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["rejected", "accepted", "interested", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionModel = mongoose.model(
  "ConnectionModel",
  connectionRequestSchema
);

module.exports = ConnectionModel;

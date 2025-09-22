const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "from user id is required"],
      ref: "userModel",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "to user id is required"],
      ref: "userModel",
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

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("from user id is equal to user id");
  }
  next();
});

const ConnectionModel = mongoose.model(
  "ConnectionModel",
  connectionRequestSchema
);

module.exports = ConnectionModel;

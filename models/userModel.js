const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
    lowercase: true,
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },

  skills: {
    type: [String],
    required: [true, "skills is required"],
    validate: {
      validator: function (v) {
        if (v.length > 4) return false;
        return true;
      },
      message: "more than 4 item not allowed",
    },
  },
  // phone: {
  //   type: String,
  //   validate: {
  //     validator: function (v) {
  //       return /\d{3}-\d{3}-\d{4}/.test(v);
  //     },
  //     message: (props) => `${props.value} is not a valid phone number!`,
  //   },
  //   required: [true, "User phone number required"],
  // },
  // role: {
  //   type: String,
  //   enum: {
  //     values: ["admin", "user", "guest"],
  //     message: "{VALUE} is not supported",
  //   },
  // },
  // summary: {
  //   type: String,
  //   minLength: 50,
  //   maxLength: 100,
  // },
  // age: {
  //   type: Number,
  //   required: true,
  //   min: 18,
  // },
  // gender: {
  //   type: String,
  //   required: true,
  //   enum: ["Male", "Female"],
  // },
  // profilePic: {
  //   type: String,
  //   required: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  //   select: false,
  // },
  // address: {
  //   city: {
  //     type: String,
  //   },
  //   state: {
  //     type: String,
  //   },
  //   houseNo: {
  //     type: String,
  //   },
  // },
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;

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
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  age: {
    type: Number,

    min: 18,
  },
  gender: {
    type: String,

    enum: ["Male", "Female"],
  },
  profilePic: {
    type: String,
  },
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;

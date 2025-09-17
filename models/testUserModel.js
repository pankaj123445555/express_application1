const mongoose = require("mongoose");
const { Schema } = mongoose;
const assert = require("assert");

const schema = new Schema({
  name: {
    type: String,
    required: [true, "cat name is required"],
  },
});
const Cat = mongoose.model("Cat", schema);

(async () => {
  const cat = new Cat();

  let error;
  try {
    await cat.save();
  } catch (err) {
    console.log("err", err);
    error = err;
  }

  assert.equal(error.errors["name"].message, "Path `name` is required.");

  error = cat.validateSync();
  assert.equal(error.errors["name"].message, "Path `name` is required.");
})();

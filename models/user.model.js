const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: {
    type: [mongoose.Types.ObjectId],
    ref: "Event",
  },
});

//Export the model
module.exports = mongoose.model("User", userSchema);

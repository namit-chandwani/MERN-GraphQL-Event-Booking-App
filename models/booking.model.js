const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Booking", bookingSchema);

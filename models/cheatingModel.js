const mongoose = require("mongoose");

const cheatingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cheatingDetalis: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

const Cheating = mongoose.model("Cheating", cheatingSchema);

module.exports = Cheating;
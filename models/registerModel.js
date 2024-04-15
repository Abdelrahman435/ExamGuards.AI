const mongoose = require("mongoose");
const User = require("./userModel");
const Course = require("./coursesModel");

const registerSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
    grade: {
      type: Number,
      default: 50,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

registerSchema.index({ course: 1, student: 1 }, { unique: true });


const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

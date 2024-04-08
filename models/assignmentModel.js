const mongoose = require("mongoose");
const User = require("./userModel");
const Course = require("./coursesModel");

const assignmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lecture is required!"],
    },
    file: {
      type: String,
      default: "default.pdf",
    },
    video: {
      type: String,
      default: "default.jpg",
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: [true, "Assignment must belong to a course"],
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

assignmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructor",
    select: "firstName lastName",
  }); // here to make the output contains the details of the instructor we should write populating

  next();
});

const assignments = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;

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
    grades: [
      {
        examId: {
          type: String,
          required: true,
        },
        nameOfExam: {
          type: String,
          required: true,
        },
        grade: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

registerSchema.index({ course: 1, student: 1 }, { unique: true });

registerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "student",
    select: " firstName lastName email _id",
  }); // here to make the output contains the details of the instructor we should write populating

  next();
});

// registerSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "course",
//     select: "-__v  -duration -active -students -durationWeeks ",
//   }); 

//   next();
// });

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

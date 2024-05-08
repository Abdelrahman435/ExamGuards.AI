const Register = require("../models/registerModel");
const catchAsync = require("../utils/catchAsync");

exports.getGradesforstudent = catchAsync(async (req, res, next) => {
  const grades = await Register.find({ student: req.user.id });

  res.status(200).json({
    status: "success",
    results: grades.length,
    data: {
      data: grades,
    },
  });
});

exports.getGradesforCourse = catchAsync(async (req, res, next) => {
  const grades = await Register.find({ course: req.params.courseId });

  res.status(200).json({
    status: "success",
    results: grades.length,
    data: {
      data: grades,
    },
  });
});

exports.getGradesforExam = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const examName = req.body.nameOfExam;

  // Find grades for the specified exam in the given course
  const grades = await Register.find({
    course: courseId,
    "grades.nameOfExam": examName,
  });

  res.status(200).json({
    status: "success",
    results: grades.length,
    data: {
      grades: grades,
    },
  });
});

// exports.update = catchAsync(async (req, res, next) => {
//   const grade = await Register.findByIdAndUpdate({grades: grade.})
// });

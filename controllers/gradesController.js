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

// exports.update = catchAsync(async (req, res, next) => {
//   const grade = await Register.findByIdAndUpdate({grades: grade.})
// });
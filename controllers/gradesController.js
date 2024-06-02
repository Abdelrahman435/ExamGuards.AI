const Register = require("../models/registerModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Exam = require("../models/examsModel");

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

  // Calculate total grades for each student
  const studentsWithTotalGrades = grades.map((grade) => {
    const totalGrade = grade.grades.reduce((acc, curr) => acc + curr.grade, 0);
    return {
      _id: grade.student._id,
      firstName: grade.student.firstName,
      lastName: grade.student.lastName,
      email: grade.student.email,
      id: grade.student.id,
      totalGrade: totalGrade,
    };
  });

  res.status(200).json({
    status: "success",
    results: studentsWithTotalGrades.length,
    data: {
      data: studentsWithTotalGrades,
    },
  });
});



exports.getGradesforExam = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const examId = req.params.examId;

  // Fetch the exam details
  const exam = await Exam.findById(examId).lean();
  if (!exam) {
    return res.status(404).json({
      status: 'fail',
      message: 'Exam not found',
    });
  }

  // Calculate the total points of the exam
  const totalPoints = exam.Questions.reduce((sum, question) => sum + question.Points, 0);
  const passThreshold = totalPoints / 2;

  // Find all students registered for the course
  const registrations = await Register.find({ course: courseId }).populate({
    path: 'student',
    select: 'firstName lastName email file', // Selecting the necessary fields
  }).lean();

  const results = registrations.map(reg => {
    const gradeEntry = reg.grades.find(grade => grade.examId === examId);
    let status, grade;

    if (gradeEntry) {
      grade = gradeEntry.grade;
      status = grade >= passThreshold ? 'passed' : 'failed';
    } else {
      grade = 0;
      status = 'absent';
    }

    return {
      student: {
        _id: reg.student._id,
        firstName: reg.student.firstName,
        lastName: reg.student.lastName,
        email: reg.student.email,
        file: reg.student.file, // Assuming the file field contains the image
      },
      grade,
      status,
    };
  });

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      grades: results,
    },
  });
});

// exports.update = catchAsync(async (req, res, next) => {
//   const grade = await Register.findByIdAndUpdate({grades: grade.})
// });

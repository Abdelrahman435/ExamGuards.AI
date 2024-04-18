const Exam = require("../models/examsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const Register = require("../models/registerModel");
const Course = require("../models/coursesModel");

exports.setuserId = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
});

exports.createExam = factory.createOne(Exam);

exports.updateExam = factory.updateOne(Exam);

exports.getExam = factory.getOne(Exam);

exports.deleteExam = factory.deleteOne(Exam);

exports.getAllExam = factory.getAll(Exam);

exports.autoGrade = catchAsync(async (req, res, next) => {
  let grade = 0;
  const data = req.body.Questions;

  // Find the exam by ID and convert it to JSON
  const exam = await Exam.findById(req.params.id).lean();

  for (let i = 0; i < data.length; i++) {
    const correctAnswers = exam.Questions[i].Answers.filter(
      (answer) => answer.correct
    );
    const userAnswer = data[i].Answer.toLowerCase(); // Convert user's answer to lowercase for case-insensitive comparison

    // Check if user's answer is correct
    if (
      correctAnswers.some((answer) => answer.body.toLowerCase() === userAnswer)
    ) {
      // Convert correct answer to lowercase for case-insensitive comparison
      grade += data[i].Points;
    }
  }

  const filter = { student: req.user.id, course: req.body.course };
  const update = {
    $push: {
      grades: {
        nameOfExam: req.body.title,
        grade: grade,
      },
    },
  };
  await Register.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    upsert: true, // Create the document if it doesn't exist
  });

  res.status(200).json({
    status: "success",
    grade: grade, // Total grade
  });
});

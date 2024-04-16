const Exam = require("../models/examsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.setExamTimes = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
});

exports.createExam = factory.createOne(Exam);

exports.updateExam = factory.updateOne(Exam);

exports.getExam = factory.getOne(Exam);

exports.deleteExam = factory.deleteOne(Exam);

exports.getAllExam = factory.getAll(Exam)

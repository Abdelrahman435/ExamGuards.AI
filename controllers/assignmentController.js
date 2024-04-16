const Assigment = require("../models/assignmentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.setAssignmentTimes = catchAsync(async (req, res, next) => {
  req.body.createdAt = new Date()
  req.body.createdBy = req.user.id;
});

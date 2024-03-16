const Course = require("../models/coursesModel");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.getAllCourses = factory.getAll(Course);

exports.getCourse = factory.getOne(Course, { path: "materials" });

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

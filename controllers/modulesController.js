const Modules = require("../models/modulesModel");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
const multer = require("multer");
const factory = require("./handlerFactory");


const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.uploadCourseModules = upload.single("file");

exports.getModule = factory.getOne(Modules);

exports.setCourseUserIds = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.instructor) req.body.instructor = req.user.id;
  next();
};

exports.createModule = factory.createOne(Modules);

exports.updateModule = factory.updateOne(Modules);

exports.getAllModules = factory.getAll(Modules);

exports.deleteModule = factory.deleteOne(Modules);

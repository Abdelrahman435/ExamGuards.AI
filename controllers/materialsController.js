const Materials = require("../models/materialsModel");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
const multer = require("multer");
const factory = require("./handlerFactory");


const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.uploadCourseMaterials = upload.single("slides");

exports.getMaterial = factory.getOne(Materials);

exports.setCourseUserIds = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.instructor) req.body.instructor = req.user.id;
  next();
};

exports.createMaterial = factory.createOne(Materials);

exports.updateMaterial = factory.updateOne(Materials);

exports.getAllMaterials = factory.getAll(Materials);

exports.deleteMaterial = factory.deleteOne(Materials);

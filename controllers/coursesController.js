const Course = require("../models/coursesModel");
const Register = require("../models/registerModel");
const Assign = require("../models/assugnInstructors");
const catchAsync = require("./../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./../utils/appError");
const multerStorage = multer.memoryStorage();
const factory = require("./handlerFactory");
const User = require("../models/userModel");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCoursePhoto = upload.single("photo");

exports.resizeCoursePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `Course-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 });
  next();
});

exports.getAllCourses = factory.getAll(Course);

exports.getCourse = factory.getOne(Course, { path: "materials" });

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.changeStatus = factory.changeStatus(Course);

exports.registerToCourse = catchAsync(async (req, res, next) => {
  await Register.create({ course: req.params.courseId, student: req.user.id });
  await Course.findByIdAndUpdate(
    req.params.courseId,
    { $push: { students: req.user.id } }, //$push to add to the array
    {
      new: true,
      runValidators: true,
    }
  );
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { courses: req.params.courseId } }, //$push to add to the array
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "The course has been registered",
  });
});

exports.assignInstructor = catchAsync(async (req, res, next) => {
  // Create a new assignment
  await Assign.create({
    course: req.body.courseId,
    instructor: req.body.instructorId,
  });

  // Update the Course document to add the new instructor
  await Course.findByIdAndUpdate(
    req.body.courseId,
    { $push: { instructors: req.body.instructorId } }, //$push to add to the array
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "success",
    msg: "The course has been assigned to the instructor",
  });
});

exports.addGrades = factory.updateOne(Register);

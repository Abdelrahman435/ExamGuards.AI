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
const mongoose = require("mongoose");

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

exports.getCoursesForStudent = catchAsync(async (req, res, next) => {
  const enrolledCourses = req.user.courses;

  const allCourses = await Course.find({ active: true });

  const availableCourses = allCourses.filter(
    (course) => !enrolledCourses.includes(course._id.toString())
  );

  res.status(200).json({
    status: "success",
    results: availableCourses.length,
    data: {
      courses: availableCourses,
    },
  });
});

exports.getCoursesPerStudent = catchAsync(async (req, res, next) => {
  const registerCourses = await Register.find({
    student: req.user.id,
  }).populate("course");

  // Extract relevant data from the registerCourses array
  const courses = registerCourses.map((register) => ({
    _id: register.course._id,
    name: register.course.name,
    description: register.course.description,
    file: register.course.file,
    status: register.status, // Add status from Register schema
  }));

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: {
      courses: courses,
    },
  });
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

exports.getCourse = factory.getOne(Course, { path: "modules" });

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.changeStatus = factory.changeStatus(Course);

exports.registerToCourse = catchAsync(async (req, res, next) => {
  await Register.create({ course: req.params.courseId, student: req.user.id });

  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { courses: req.params.courseId } },
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

// exports.getStudentsPerCourse = catchAsync(async (req, res, next) => {});

exports.approvedRegistration = catchAsync(async (req, res, next) => {
  // Update course with new student
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.courseId,
    { $push: { students: req.params.studentId } },
    {
      new: true,
      runValidators: true,
    }
  );

  // Update registration status
  await Register.findOneAndUpdate(
    { course: req.params.courseId, student: req.params.studentId },
    { status: true },
    {
      new: true,
      upsert: true, // If registration does not exist, create a new one
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
  });
});

exports.getPendingRegistrations = catchAsync(async (req, res, next) => {
  const registrations = await Register.find({ status: false })
    .populate({
      path: "course", // Assuming 'course' field in Register model references the Course model
      select: "name", // Selecting only the name field from the Course model
    })
    .populate({
      path: "student", // Assuming 'student' field in Register model references the User model
      select: "firstName lastName email", // Selecting only the first name, last name, and email fields from the User model
    });

  const pendingRegistrations = registrations.map((reg) => ({
    courseId: reg.course._id,
    courseName: reg.course.name,
    studentId: reg.student._id,
    studentName: `${reg.student.firstName} ${reg.student.lastName}`,
    studentEmail: reg.student.email,
  }));

  res.status(200).json({
    status: "success",
    data: pendingRegistrations,
  });
});

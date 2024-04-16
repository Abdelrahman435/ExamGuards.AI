const express = require("express");
const courseController = require("../controllers/coursesController");
const authController = require("./../controllers/authController");
const modulesRouter = require("../routes/modules");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const examRouter = require("../routes/exams")

const router = express.Router();

router.use("/:courseId/modules", modulesRouter);
router.use("/:courseId/exams", examRouter);

router
  .route("/")
  .get(authController.protect, courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo("admin", "super admin"),
    courseController.uploadCoursePhoto,
    courseController.resizeCoursePhoto,
    uploadToCloudinary,
    courseController.createCourse
  );

router
  .route("/:id")
  .get(authController.protect, courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "super admin"),
    courseController.uploadCoursePhoto,
    courseController.resizeCoursePhoto,
    uploadToCloudinary,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "super admin"),
    courseController.deleteCourse
  );

router.patch(
  "/status/:id",
  authController.protect,
  authController.restrictTo("admin", "super admin"),
  courseController.changeStatus
);

router.post(
  "/register/:courseId",
  authController.protect,
  authController.restrictTo("student"),
  courseController.registerToCourse
);

router.patch(
  "/addGrade/:id",
  authController.protect,
  authController.restrictTo("instructor"),
  courseController.addGrades
);

router.post(
  "/assign",
  authController.protect,
  authController.restrictTo("admin"),
  courseController.assignInstructor
);
module.exports = router;

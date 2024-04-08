const express = require("express");
const courseController = require("../controllers/coursesController");
const authController = require("./../controllers/authController");
const modulesRouter = require("../routes/modules");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");

const router = express.Router();

router.use("/:courseId/modules", modulesRouter);

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

router.patch("/status/:id", courseController.changeStatus);

module.exports = router;

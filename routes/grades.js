const express = require("express");
var router = express.Router();
const gradesController = require("../controllers/gradesController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get(
  "/student",
  authController.restrictTo("student"),
  gradesController.getGradesforstudent
);

router.get(
  "/course/:courseId",
  authController.restrictTo("instructor"),
  gradesController.getGradesforCourse
);

module.exports = router;
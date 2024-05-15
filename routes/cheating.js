const express = require("express");
const router = express.Router();
const cheatingController = require("../controllers/cheatingControllers");
const authController = require("../controllers/authController");
const multer = require("multer");

router.use(authController.protect);

// Define storage for multer
const upload = multer({ dest: "uploads/" });
// Route to handle cheating detection
router.post("/", upload.array("image_files"), cheatingController.eyeTracking);

router.post(
  "/objects",
  upload.array("image_files"),
  cheatingController.objectDetection
);

module.exports = router;

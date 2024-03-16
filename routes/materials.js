const express = require("express");
const materialsController = require("../controllers/materialsController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true }); //to get access to params in courses router

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("instructor"),
    materialsController.setCourseUserIds,
    materialsController.createMaterial
  )
  .get(materialsController.getAllMaterials);

router
  .route("/:id")
  .get(materialsController.getMaterial)
  .patch(
    authController.restrictTo("instructor"),
    materialsController.updateMaterial
  )
  .delete(
    authController.restrictTo("instructor"),
    materialsController.deleteMaterial
  );

module.exports = router;

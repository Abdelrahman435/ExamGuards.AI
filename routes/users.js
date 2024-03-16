var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/usersControllers");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updatePassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);

router.use(authController.restrictTo("admin"));

router.patch("/deactivate/:id", userController.deactivate);

router
  .route("/:id")
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

router.get("/", userController.getAllUsers);
module.exports = router;

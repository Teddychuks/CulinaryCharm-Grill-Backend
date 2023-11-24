const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetpassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/updatemypassword").patch(authController.updatePassword);

router
  .route("/updatemyaccount")
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMyAccount
  );

router
  .route("/myaccount")
  .get(userController.getPersonal, userController.getAccount);

router.route("/deletemyaccount").delete(userController.deleteMyAccount);

router.use(authController.restrictTo("admin"));

router.route("/").get(authController.protect, userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getAccount)
  .delete(userController.deleteAccount);

module.exports = router;

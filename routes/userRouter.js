const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updatemypassword", authController.updatePassword);
router.patch("/updatemyaccount", userController.updateAccount);
router.get("/myaccount", userController.getPersonal, userController.getAccount);
router.delete("/deletemyaccount", userController.deleteMyAccount);

router.use(authController.restrictTo("admin"));

router.get("/", authController.protect, userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getAccount)
  .delete(userController.deleteAccount);

module.exports = router;

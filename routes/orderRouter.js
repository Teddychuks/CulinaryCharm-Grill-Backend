const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

router.route("/statistics").get(orderController.orderStatistics);

router.use(authController.protect);
router.route("/").get(orderController.getAllOrders);
router
  .route("/create")
  .post(authController.restrictTo("user"), orderController.createOrder);
router
  .route("/:id")
  .get(orderController.getOrder)
  .delete(authController.restrictTo("admin"), orderController.deleteOrder);

module.exports = router;

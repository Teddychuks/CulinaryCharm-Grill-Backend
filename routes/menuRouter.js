// Your router setup
const express = require("express");

const menuController = require("../controllers/menuController");
const authController = require("../controllers/authController");
const reviewsRouter = require("./reviewsRouter");
const router = express.Router();

router.route("/statistics").get(menuController.aggregateMenuStatistics);
router.use("/:type/:menuId/reviews", reviewsRouter);

router.route("/:type").get(menuController.getAllMenuItems);
router
  .route("/:type/create")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    menuController.createMenuItem
  );

router
  .route("/:type/:id")
  .get(menuController.getMenuItem)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    menuController.updateMenuItem
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    menuController.deleteMenuItem
  );

module.exports = router;

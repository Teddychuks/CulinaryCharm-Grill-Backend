// Your router setup
const express = require("express");

const menuController = require("../controllers/menuController");
const reviewsRouter = require("./reviewsRouter");
const router = express.Router();

router.route("/statistics").get(menuController.aggregateMenuStatistics);
router.use("/:type/:menuId/reviews", reviewsRouter);

router.route("/:type").get(menuController.getAllMenuItems);
router.route("/:type/create").post(menuController.createMenuItem);

router
  .route("/:type/:id")
  .get(menuController.getMenuItem)
  .patch(menuController.updateMenuItem)
  .delete(menuController.deleteMenuItem);

module.exports = router;

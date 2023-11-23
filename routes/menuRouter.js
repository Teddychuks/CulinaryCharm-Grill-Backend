// Your router setup
const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");

router.route("/:type").get(menuController.getAllMenuItems);
router.route("/:type/create").post(menuController.createMenuItem);

router
  .route("/:type/:id")
  .get(menuController.getMenuItem)
  .patch(menuController.updateMenuItem)
  .delete(menuController.deleteMenuItem);

module.exports = router;

const Reviews = require("../models/reviewsModel");
const catchAsync = require("../utilities/catchAsync");
const Orders = require("../models/orderModel");
const AppError = require("../utilities/appError");

exports.createReviews = catchAsync(async (req, res, next) => {
  // Find all orders
  const orders = await Orders.find({});

  const hasOrderedItem = orders.some(
    (order) =>
      order.username === req.user.name &&
      order.menu.some(
        (menuItem) => menuItem.itemId.toString() === req.body.menu
      )
  );

  if (!hasOrderedItem) {
    return next(
      new AppError(`You can only review items you have ordered`, 403)
    );
  }

  const newReview = await Reviews.create(req.body);

  res.status(201).json({
    status: "success",
    data: { reviews: newReview },
  });
});
exports.getAllReviews = catchAsync(async (req, res) => {
  // Searching for reviews where the menu is equal to the current menuId
  let filter = {};
  if (req.params.menuId) filter = { menu: req.params.menuId };
  const reviews = await Reviews.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

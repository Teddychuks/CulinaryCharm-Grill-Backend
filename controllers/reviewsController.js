const Reviews = require("../models/reviewsModel");
const catchAsync = require("../utilities/catchAsync");
const Order = require("../models/orderModel");

exports.createReviews = catchAsync(async (req, res, next) => {
  const { rating, review, menu: menuItemId } = req.body;
  const userId = req.user._id;

  const userOrders = await Order.find({
    username: req.user.name,
  });

  const hasOrdered = userOrders.some((order) => {
    const hasOrderedInOrder = order.menu.some((item) => {
      return item.itemId.toString() === menuItemId;
    });
    return hasOrderedInOrder;
  });

  if (!hasOrdered) {
    return res.status(403).json({
      status: "error",
      message: "You cannot create a review for an item you have not ordered.",
    });
  }

  const newReview = await Reviews.create({
    review,
    rating,
    menu: menuItemId,
    user: userId,
  });

  res.status(201).json({
    status: "success",
    data: { reviews: newReview },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.menuId) filter = { menu: req.params.menuId };

  // Add sort parameter to retrieve reviews in ascending order based on createdAt
  const reviews = await Reviews.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const doc = await Reviews.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that ID", req.params.id));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

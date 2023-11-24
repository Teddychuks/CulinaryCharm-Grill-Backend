exports.createReviews = catchAsync(async (req, res) => {
  try {
    // Find all orders
    const orders = await Orders.find({});

    // Check if req.body.menu exists in any order's menu array
    const hasOrderedItem = orders.some((order) =>
      order.menu.some((menuItem) => menuItem.itemId === req.body.menu)
    );

    if (!hasOrderedItem) {
      return res.status(403).json({
        status: "error",
        message: "You can only review items you have ordered.",
      });
    }

    const newReview = await Reviews.create(req.body);

    res.status(201).json({
      status: "success",
      data: { reviews: newReview },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
});

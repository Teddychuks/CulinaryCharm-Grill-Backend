const Order = require("./models/orderModel");
const catchAsync = require("./utilities/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  try {
    const { menu, quantity, status, menuModel } = req.body;

    // Check for valid input
    if (!menu || !quantity || !status || !menuModel) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Populate the menu
    const populatedMenu = await Order.populate(
      Array.isArray(menu) ? menu : [menu],
      {
        path: "menu",
        select: "name price picture",
      }
    );

    console.log(populatedMenu);
    // Calculate total price
    const totalPrice = calculateTotalPrice(populatedMenu, quantity);

    // Create a new order and save it to the database
    const newOrder = new Order({
      username: req.user.name,
      menu,
      quantity,
      status,
      totalPrice,
      menuModel,
    });

    // Save the order
    await newOrder.save();

    // Respond with success
    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    // Pass the error to the error-handling middleware
    next(error);
  }
});

// Function to calculate total price based on quantities of each item
function calculateTotalPrice(populatedMenu, quantities) {
  let totalPrice = 0;

  for (let i = 0; i < populatedMenu.length; i++) {
    const menuItem = populatedMenu[i].menu;
    const itemQuantity = quantities[i];
    totalPrice += menuItem.price * itemQuantity;
  }

  return totalPrice;
}

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find().populate({
    path: "menu",
    select: "name price picture",
  });
  res.status(200).json({
    status: "success",
    results: order.length,
    data: { order },
  });

  next();
});

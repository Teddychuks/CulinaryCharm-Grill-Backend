const Order = require("../models/orderModel");
const Menu = require("../models/menuModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { menu } = req.body;

  let sumTotalPrice = 0;
  const orderItems = [];

  for (const { itemId, quantity } of menu) {
    const menuItem = await Menu.findById(itemId);
    const menuItemName = menuItem.name;
    const menuItemPrice = menuItem.price;
    const itemTotalPrice = menuItemPrice * quantity;

    orderItems.push({
      itemId: itemId,
      name: menuItemName,
      price: menuItemPrice,
      quantity,
      itemTotalPrice,
    });

    sumTotalPrice += itemTotalPrice;
  }

  const newOrder = new Order({
    username: req.user.name,
    menu: orderItems,
    sumTotalPrice,
  });

  await newOrder.save();

  res.status(201).json({
    message: "Order placed successfully",
    data: newOrder,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find();
  res.status(200).json({
    status: "success",
    results: order.length,
    data: { order },
  });

  next();
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError(`No order with this ID:${req.params.id}`, 404));
  }

  res.status(200).json({
    data: { order },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError(`No order with this ID:${req.params.id}`, 404));
  }

  res.status(200).json({
    data: null,
  });
});

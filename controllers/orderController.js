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

    const menuItemType = menuItem.type;
    const menuItemName = menuItem.name;
    const menuItemPrice = menuItem.price;
    const itemTotalPrice = menuItemPrice * quantity;

    orderItems.push({
      itemId: itemId,
      category: menuItemType,
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

exports.getUserOrders = catchAsync(async (req, res) => {
  const username = req.user.name;
  console.log(username);

  const orders = await Order.find({ username: username }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: orders.length,
    orders: orders,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find();
  res.status(200).json({
    status: "success",
    results: order.length,
    order,
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

exports.orderStatistics = catchAsync(async (req, res, next) => {
  const result = await Order.aggregate([
    {
      $facet: {
        totalRevenue: [
          {
            $group: {
              _id: null,
              totalRevenueNow: { $sum: "$sumTotalPrice" },
            },
          },
        ],
        totalRevenueOvertime: [
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
              },
              totalRevenue: { $sum: "$sumTotalPrice" },
            },
          },
          { $sort: { "_id.date": 1 } }, // Add this $sort stage to sort by date
        ],
        popularMenuItems: [
          { $unwind: "$menu" },
          {
            $group: {
              _id: "$menu.itemId",
              name: { $first: "$menu.name" },
              totalQuantitySold: { $sum: "$menu.quantity" },
            },
          },
          { $sort: { totalQuantitySold: -1 } },
          { $limit: 7 },
        ],
        averageOrderValue: [
          {
            $group: {
              _id: null,
              averageOrderValue: { $avg: "$sumTotalPrice" },
            },
          },
          {
            $project: {
              averageOrderValue: { $round: ["$averageOrderValue", 2] },
            },
          },
        ],
        userSpendingPatterns: [
          {
            $group: {
              _id: "$username",
              totalSpending: { $sum: "$sumTotalPrice" },
            },
          },
          { $sort: { totalSpending: -1 } },
        ],
        topCustomers: [
          {
            $group: {
              _id: "$username",
              totalSpending: { $sum: "$sumTotalPrice" },
            },
          },
          { $sort: { totalSpending: -1 } },
          { $limit: 7 },
        ],
        quantitySoldOverTime: [
          { $unwind: "$menu" },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
              },
              totalQuantitySold: { $sum: "$menu.quantity" },
            },
          },
          { $sort: { "_id.date": 1 } },
          { $limit: 30 },
        ],
      },
    },
  ]);

  const {
    totalRevenue,
    totalRevenueOvertime,
    popularMenuItems,
    averageOrderValue,
    userSpendingPatterns,
    topCustomers,
    quantitySoldOverTime,
  } = result[0];

  res.status(200).json({
    status: "success",
    orderstats: {
      totalRevenue,
      totalRevenueOvertime,
      popularMenuItems,
      averageOrderValue,
      userSpendingPatterns,
      topCustomers,
      quantitySoldOverTime,
    },
  });
});

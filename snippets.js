const Order = require("../models/orderModel");
// const Appetizer = require("../models/appetizerModel");
const catchAsync = require("../utilities/catchAsync");

const createOrder = catchAsync(async (req, res, next) => {
  const { menu, quantity, status, totalPrice, menuModel } = req.body;

  try {
    // Create a new order without populating the menu field
    const newOrder = await Order.create({
      username: req.user.name,
      menu,
      quantity,
      status,
      totalPrice,
      menuModel,
    });

    const populatedOrder = await Order.findById(newOrder._id).populate({
      path: "menu",
      select: "name price picture",
    });

    newOrder.menu = populatedOrder.menu;

    // Save the updated order
    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = {
  createOrder,
};

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },

    username: {
      type: String,
      required: true,
    },

    menu: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: String,

    price: Number,

    picture: String,

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      default: "Completed",
      enum: ["Completed", "Pending", "In Progress"],
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    menuModel: {
      type: String,
      required: true,
      enum: ["Maincourse", "Appetizer", "Cocktails", "Pizza"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Middleware to dynamically set the ref based on menuModel before saving
orderSchema.pre("save", function (next) {
  if (this.isModified("menuModel")) {
    // Set the ref based on the menuModel value
    this.model("Order").schema.path("menu").options.ref = this.menuModel;
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

exports.createOrder = catchAsync(async (req, res, next) => {
  const { menu, quantity, status, totalPrice, menuModel } = req.body;

  try {
    // Create a new order and save it to the database
    const newOrder = new Order({
      username: req.user.name,
      menu,
      quantity,
      status,
      totalPrice,
      menuModel,
    });

    newOrder.populate({
      path: "menu",
      select: "name price picture",
    });

    await newOrder.save();

    console.log(newOrder);
    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

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

    menu: [
      {
        itemId: {
          type: mongoose.Schema.ObjectId,
        },
        category: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        itemTotalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      default: "Completed",
      enum: ["Completed", "Pending", "In Progress"],
    },

    sumTotalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

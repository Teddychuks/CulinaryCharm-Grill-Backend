const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["appetizer", "maincourse", "pizza", "cocktail"],
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [
        60,
        "A menu item name must be less or equal to 60 characters",
      ],
      minlength: [3, "A menu item name must not be less than 3 characters"],
    },
    description: {
      type: String,
      required: true,
      required: [true, "A menu item must have a description"],
      maxlength: [
        500,
        "Menu item description must be less or equal to 500 characters",
      ],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    preparationTime: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
      required: [true, "Calories should be stated on each item"],
      max: [2500, "Calories should not be above 2,500"],
    },
    picture: {
      type: String,
      default: "",
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be between 1 and 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;

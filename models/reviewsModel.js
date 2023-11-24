const mongoose = require("mongoose");
const Menu = require("./menuModel");

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: [true],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
reviewsSchema.index({ menu: 1, user: 1 }, { unique: true });

reviewsSchema.pre(/^find/, function () {
  this.populate({
    path: "menu",
    select: "name",
  }).populate({
    path: "user",
    select: "name photo",
  });
});

reviewsSchema.statics.calcAverageRatings = async function (menuId) {
  const stats = await this.aggregate([
    {
      $match: { menu: menuId },
    },
    {
      $group: {
        _id: "$menu", // Grouping the menu by id
        nRating: { $sum: 1 }, //Adding one for each document
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Menu.findByIdAndUpdate(menuId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Menu.findByIdAndUpdate(menuId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// this.constructor refers to the model that the document belongs to, in this case, reviewsSchema.
reviewsSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.menu);
});

// Deleting and updating reviews:
reviewsSchema.pre(/^findOneAnd/, async function (next) {
  // await this.clone().findOne();. It essentially takes a snapshot of the document before any modifications
  this.currentDoc = await this.clone().findOne();
  next();
});

reviewsSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) await doc.constructor.calcAverageRatings(doc.menu);
});

const Reviews = mongoose.model("Reviews", reviewsSchema);
module.exports = Reviews;

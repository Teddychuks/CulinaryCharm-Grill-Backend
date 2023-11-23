const Menu = require("../models/menuModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAllMenuItems = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  if (!type) {
    return next(new AppError(`Invalid data type:${type}`, 404));
  }

  const menuItems = await Menu.find({ type });
  res.status(200).json({
    status: "success",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  if (!type) {
    return next(new AppError(`Invalid data type:${type}`, 404));
  }

  const newMenuItem = await Menu.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newMenuItem,
    },
  });
});

exports.getMenuItem = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  if (!type) {
    return next(new AppError(`Invalid data type:${type}`, 404));
  }
  const menuItem = await Menu.findById(req.params.id);

  if (!menuItem) {
    return next(new AppError(`No menu with this ID:${req.params.id}`, 404));
  }

  res.status(200).json({
    data: { menuItem },
  });
});

exports.updateMenuItem = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  if (!type) {
    return next(new AppError(`Invalid data type:${type}`, 404));
  }

  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    { $set: { ...req.body, type: undefined } },
    { new: true, runValidators: true }
  );

  if (!menu) {
    return next(
      new AppError(`No menu found with that ID: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      menu,
    },
  });
});

exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  if (!type) {
    return next(new AppError(`Invalid data type:${type}`, 404));
  }
  const menu = await Menu.findByIdAndDelete(req.params.id);

  if (!menu) {
    new AppError(`No menu found with that ID: ${req.params.id}`, 404);
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

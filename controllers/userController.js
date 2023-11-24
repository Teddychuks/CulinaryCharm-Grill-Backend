const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

const multerStorage = multer.memoryStorage();

// This function filters the image file the users is uploading
const multerFilter = (req, file, cb) => {
  // Note that the mimetype filename always starts with "image"
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image ", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// this function uploads user photo to the photo field
exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  //Keeping the image in memory to resize it
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`No user with this ID:${req.params.id}`, 404));
  }

  res.status(200).json({
    data: { user },
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new AppError(`No user with that ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getPersonal = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMyAccount = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password update", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

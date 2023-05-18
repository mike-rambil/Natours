const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: { user },
  });
});
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
exports.createUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You cannot update password here. Please head to /updateMyPassword',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdandUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

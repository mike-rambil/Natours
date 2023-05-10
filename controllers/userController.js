const User = require('../models/userModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

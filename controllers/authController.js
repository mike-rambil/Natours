const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const ms = require('ms'); // Library for parsing duration strings
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const parseDurationString = (durationString) => {
  const milliseconds = ms(durationString);
  return milliseconds;
};

//  TOKEN
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const expiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
  const expirationMilliseconds = parseDurationString(expiresIn);
  const expirationDate = new Date(Date.now() + expirationMilliseconds);

  const cookieOptions = {
    domain: 'localhost',
    path: '/',
    expires: expirationDate,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check Email and Password Exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //Check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if then send token to client
  createSendToken(user, 201, res);
  // const token = signToken(user._id);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Check for cookie
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Validate token
  if (!token) {
    return next(new AppError('You are not logged in! Please log in.', 401));
  }

  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token does not exist.', 401)
      );
    }

    // Check if password was changed after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    // console.log(user);
    // Set the authenticated user in res.locals
    req.user = user;

    // res.locals.user = req.user;

    next();
  } catch (error) {
    return next(new AppError('Invalid token.', 401));
  }
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to access this route!', 403)
      );
    }
    next();
  };

// Only for rendered pages, no errors are thrown!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verifies token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(
          new AppError('The user belonging to this token does not exist.', 401)
        );
      }

      // 3) Check if password was changed after the token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError(
            'User recently changed password! Please log in again.',
            401
          )
        );
      }
      // THERE IS A LOGGED IN USER!
      res.locals.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to access this route!', 403)
      );
    }
    next();
  };

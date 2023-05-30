const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

//* 1) ----------------------MIDDLEWARES-------------------------

app.use(express.static(path.join(__dirname, 'public')));

//--Pug setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // OR app.use(express.static(`${__dirname}/public`));

app.use(morgan('dev'));

//--CORS Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Setting the "Access-Control-Allow-Credentials" header
// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend URL
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//--BodyParser Middleware
app.use(express.json());
app.use(cookieParser());

//--Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//--Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//--------------------------ERROR HANDLER for unknown pages-------------------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

//Line 74

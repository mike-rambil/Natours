const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

//Pug setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(`${__dirname}/public`));

app.use(express.static(path.join(__dirname, 'public')));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// 1) MIDDLEWARES
// FIXME:
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
//   console.log(process.env.NODE_ENV);
// }

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//---ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES

app.use(morgan('dev'));
app.use(express.json());

// 2) READ FILES
// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the server side...!');
// });

// app.post('/', (req, res) => {
//   res.status(200).send('You can POST to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 3) ROUTE HANDLER

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    tour,
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({ message: 'Error writing data to file' });
      } else {
        res.status(201).json({
          data: {
            tour: newTour,
          },
        });
      }
    }
  );
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
const getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
const createUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
const deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};

// 4) ROUTES

// app.get('/api/v1/tours/', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).delete(deleteTour);
app.route('api//v1/users').get(getAllUsers).post(createUsers);
app.route('api//v1/user/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 5) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App runnning on port ${port} ....`);
});

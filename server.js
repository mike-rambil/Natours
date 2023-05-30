const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

// -----------Uncaught Exception Handler--------------
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down....');
  console.log(err);
  process.exit(1);
});

const app = require('./app');

// -----------Config.env Path--------------
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successful...');
  })
  .catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

const port = process.env.PORT;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App runnning on port ${port} ....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED Rejection....Shutting down');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

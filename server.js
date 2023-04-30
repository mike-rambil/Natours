const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
const DB =
  'mongodb+srv://mike:eILx7luQJQnyTaAc@cluster0.dsrld9r.mongodb.net/natours?retryWrites=true&w=majority';
console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('DB Connection Successful...');
  })
  .catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App runnning on port ${port} ....`);
});

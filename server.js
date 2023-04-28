// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App runnning on port ${port} ....`);
});

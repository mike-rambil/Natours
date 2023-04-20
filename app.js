const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from the server side...!');
});

app.post('/', (req, res) => {
  res.status(200).send('You can POST to this endpoint...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App runnning on port ${port} ....`);
});

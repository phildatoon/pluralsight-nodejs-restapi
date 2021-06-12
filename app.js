const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const mongooseOpts = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

if (process.env.ENV === 'Test') {
  console.log('Environment: Test');
  const db = mongoose.connect('mongodb://127.0.0.1:27017/bookAPI_test', mongooseOpts);
} else {
  console.log('Environment: ' + process.env.ENV);
  const db = mongoose.connect('mongodb://127.0.0.1:27017/bookAPI', mongooseOpts);
}

const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!');
});

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;

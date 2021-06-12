const express = require('express');
const mongoose = require('mongoose');

const app = express();
const db = mongoose.connect('mongodb://127.0.0.1:27017/bookAPI', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');

bookRouter.route('/books')
  .get((req, res) => {
    // ignore all unwanted query parameters and obtain values only for those needed
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // find books from DB
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  });

bookRouter.route('/books/:bookId')
  .get((req, res) => {
    // find books by ID from DB
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  });

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

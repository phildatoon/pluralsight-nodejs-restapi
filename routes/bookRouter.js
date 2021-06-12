const express = require('express');

function routes(Book) {
  const bookRouter = express.Router();

  bookRouter.route('/books')
    .post((req, res) => {
      const book = new Book(req.body);

      book.save();
      return res.status(201).json(book);
    })
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

  return bookRouter;
}

module.exports = routes;
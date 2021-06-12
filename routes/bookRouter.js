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

  // middleware (request interceptor)
  bookRouter.use('/books/:bookId', (req, res, next) => {
    // find books by ID from DB
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }

      if (book) {
        req.book = book;
        return next();
      }

      return res.sendStatus(404);
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => res.json(req.book))
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;

      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .patch((req, res) => {
        const { book } = req;

        // eslint-disable-next-line no-underscore-dangle
        if (req.body._id) {
          // eslint-disable-next-line no-underscore-dangle
          delete req.body._id; // remove '_id' field if supplied by user
        }

        Object.entries(req.body).forEach((item) => {
          const key = item[0];
          const value = item[1];
          book[key] = value;
        });

        req.book.save((err) => {
          if (err) {
            return res.send(err);
          }
          return res.json(book);
        });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
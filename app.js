// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = 'CHANGE_THIS_SECRET_TO_SOMETHING_SECURE';
const SESSION_SECRET = 'another_secret_change_me';
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set true under HTTPS
}));

// In-memory stores for demo (replace with DB in production)
const users = []; // { username, password }
const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'books.json'), 'utf8'));

// Helper: find book by ISBN
function findBookByISBN(isbn) {
  return books[isbn] || null;
}

// Middleware to protect routes: check session or JWT
function ensureAuthenticated(req, res, next) {
  // session-based
  if (req.session && req.session.username) {
    req.user = { username: req.session.username };
    return next();
  }
  // JWT-based: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { username: payload.username };
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  return res.status(401).json({ message: 'Authentication required' });
}

/* ---------- Public endpoints ---------- */

// Task 1: Get list of all books
app.get('/books', (req, res) => {
  // return array of book meta
  const all = Object.values(books).map(b => ({
    isbn: b.isbn,
    title: b.title,
    authors: b.authors,
    publisher: b.publisher
  }));
  res.json(all);
});

// Task 2: Get book by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Task 3: Get books by author
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const matches = Object.values(books).filter(b =>
    b.authors.some(a => a.toLowerCase().includes(author))
  );
  res.json(matches);
});

// Task 4: Get books by title
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const matches = Object.values(books).filter(b =>
    b.title.toLowerCase().includes(title)
  );
  res.json(matches);
});

// Task 5: Get book reviews (by ISBN)
app.get('/books/:isbn/reviews', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book.reviews || {});
});

/* ---------- Auth endpoints ---------- */

// Task 6: Register new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  if (users.find(u => u.username === username)) return res.status(400).json({ message: 'Username already exists' });
  users.push({ username, password });
  res.status(201).json({ message: 'Registered successfully' });
});

// Task 7: Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // create session
  req.session.username = username;

  // create JWT
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

/* ---------- Review endpoints (protected) ---------- */

// Task 8: Add or modify a book review (only logged-in users; user can change only own review)
app.put('/books/:isbn/review', ensureAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const { rating, comment } = req.body;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  if (!book.reviews) book.reviews = {};

  // reviews keyed by username so user owns their review
  book.reviews[req.user.username] = { username: req.user.username, rating, comment };
  res.json({ message: 'Review added/updated', review: book.reviews[req.user.username] });
});

// Task 9: Delete a book review added by that particular user
app.delete('/books/:isbn/review', ensureAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews || !book.reviews[req.user.username]) return res.status(404).json({ message: 'Review not found for user' });

  delete book.reviews[req.user.username];
  res.json({ message: 'Review deleted' });
});

/* ---------- start server ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Book review server listening on port ${PORT}`);
});

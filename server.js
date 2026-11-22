const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(session({ secret: 'lib123', resave: false, saveUninitialized: false }));
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost', user: 'root', password: '', database: 'library'
});

function auth(req, res, next) {
  if (req.session.user) next();
  else res.status(401).json({ error: 'Please login first' });
}

function valid(b) {
  return b.title && b.author && b.title.trim() && b.author.trim() &&
    b.price !== '' && Number(b.price) >= 0 &&
    Number.isInteger(Number(b.qty)) && Number(b.qty) >= 0;
}

app.get('/', (req, res) => res.redirect('/login.html'));

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!/^[a-zA-Z0-9_]{3,15}$/.test(username || ''))
    return res.status(400).json({ error: 'Username: 3-15 letters, numbers or _' });
  if (!password || password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const hash = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users(username,password) VALUES(?,?)', [username, hash], err => {
    if (err && err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ error: 'Username already taken' });
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Registered, now login' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username=?', [username], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (rows.length == 0 || !(await bcrypt.compare(password, rows[0].password)))
      return res.status(401).json({ error: 'Wrong username or password' });
    req.session.user = rows[0].username;
    res.json({ message: 'Login ok' });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login.html'));
});

app.get('/books', (req, res) => {
  if (!req.session.user) return res.redirect('/login.html');
  res.sendFile(__dirname + '/views/books.html');
});

app.get('/api/books', auth, (req, res) => {
  db.query('SELECT * FROM books', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/books', auth, (req, res) => {
  const b = req.body;
  if (!valid(b)) return res.status(400).json({ error: 'Invalid book data' });
  db.query('INSERT INTO books(title,author,price,qty) VALUES(?,?,?,?)',
    [b.title.trim(), b.author.trim(), b.price, b.qty], err => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Book added' });
    });
});

app.put('/api/books/:id', auth, (req, res) => {
  const b = req.body;
  if (!valid(b)) return res.status(400).json({ error: 'Invalid book data' });
  db.query('UPDATE books SET title=?, author=?, price=?, qty=? WHERE id=?',
    [b.title.trim(), b.author.trim(), b.price, b.qty, req.params.id], err => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Book updated' });
    });
});

app.delete('/api/books/:id', auth, (req, res) => {
  db.query('DELETE FROM books WHERE id=?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Book deleted' });
  });
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
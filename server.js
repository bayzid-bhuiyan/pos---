const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'pos_system'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected!');
});

// Routes

// Register
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;
  db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (err) => {
    if (err) return res.status(500).send(err);
    res.send('User registered');
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Invalid login');
    res.json(results[0]);
  });
});
// Add more routes for products, sales, etc.

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

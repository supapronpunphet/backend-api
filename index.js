const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection(process.env.DATABASE_URL);

// test route
app.get('/', (req, res) => {
  res.send('API Working');
});

// GET all users
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// GET user by id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT * FROM users WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result[0]);
      }
    }
  );
});

// POST create user
app.post('/users', (req, res) => {
  const { fname, lname, username, password, avatar } = req.body;

  connection.query(
    'INSERT INTO users (fname, lname, username, password, avatar) VALUES (?, ?, ?, ?, ?)',
    [fname, lname, username, password, avatar],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { fname, lname, username, password, avatar } = req.body;

  connection.query(
    'UPDATE users SET fname=?, lname=?, username=?, password=?, avatar=? WHERE id=?',
    [fname, lname, username, password, avatar, id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'DELETE FROM users WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
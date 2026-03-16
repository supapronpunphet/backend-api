const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// GET all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// GET user by id
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// POST create user
app.post("/users", async (req, res) => {
  const { fname, lname, username, password, avatar } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO users (fname, lname, username, password, avatar) VALUES (?, ?, ?, ?, ?)",
      [fname, lname, username, password, avatar]
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// PUT update user
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { fname, lname, username, password, avatar } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE users SET fname=?, lname=?, username=?, password=?, avatar=? WHERE id=?",
      [fname, lname, username, password, avatar, id]
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
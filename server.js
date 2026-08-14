const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL)");
  db.run("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, quantity INTEGER, total REAL)");
  
  db.run("INSERT OR IGNORE INTO products (id, name, price) VALUES (1, 'Laptop', 50000)");
  db.run("INSERT OR IGNORE INTO products (id, name, price) VALUES (2, 'Headphone', 2000)");
  db.run("INSERT OR IGNORE INTO products (id, name, price) VALUES (3, 'Mouse', 800)");
});

// Products API
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    res.json(rows);
  });
});

// Signup API
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, 
  [name, email, password], function(err){
    if(err) return res.json({success: false, message: "Email already exists"});
    res.json({success: true, message: "Signup ho gaya!"});
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, 
  [email, password], (err, row) => {
    if(row) res.json({success: true, user_id: row.id});
    else res.json({success: false, message: "Wrong email or password"});
  });
});

// Order API
app.post('/api/order', (req, res) => {
  const { user_id, cart, total } = req.body;
  cart.forEach(item => {
  db.run(`INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)`, 
    [user_id || 1, item.id, 1, item.price]);
  });
  res.json({ success: true, message: "Order placed successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
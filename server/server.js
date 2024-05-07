const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projekatmobilno'
});

connection.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
const staticPath = path.join(__dirname, 'www'); // Adjust path as needed
app.use(express.static(staticPath));

// Signup endpoint
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  connection.query(query, [name, email, password], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const path = require('path');

// Definišemo dozvoljene origin-e
const allowedOrigins = ['http://localhost:3000'];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: ['Content-Type'], // Specify the headers exposed to the client
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow Content-Type and Authorization headers
}));

// Serve static files
const staticPath = path.join(__dirname, 'www'); // Adjust path as needed
app.use(express.static(staticPath));

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projekatmobilno'
});

connection.connect();

// Endpoint for updating or creating a profile
app.post('/updateOrCreateProfile', (req, res) => {
  const { name, address, city, postal_code, email, phone_number } = req.body;

  // Check if phone_number is provided and not null
  if (!phone_number) {
    res.status(400).json({ error: 'phone_number is required' });
    return;
  }

  // Check if the user already exists by email
  const checkUserQuery = `SELECT * FROM user WHERE email = ?`;
  connection.query(checkUserQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // If user exists, update their profile
      const userId = results[0].userid;
      const updateQuery = `UPDATE user SET name=?, address=?, city=?, postal_code=?, email=?, phone_number=? WHERE userid=?`;
      connection.query(updateQuery, [name, address, city, postal_code, email, phone_number, userId], (error, results, fields) => {
        if (error) {
          console.error('Error updating profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json({ message: 'Profile updated successfully' });
      });
    } else {
      // If user does not exist, create a new profile
      const createQuery = `INSERT INTO user (name, address, city, postal_code, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
      connection.query(createQuery, [name, address, city, postal_code, email, phone_number], (error, results, fields) => {
        if (error) {
          console.error('Error creating profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json({ message: 'Profile created successfully' });
      });
    }
  });
});

app.post('/checkUserByEmail', (req, res) => {
  const { email } = req.body;
  const checkUserQuery = `SELECT * FROM user WHERE email = ?`;
  connection.query(checkUserQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ exists: results.length > 0 });
  });
});


const port = 3000; // Definicija porta

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


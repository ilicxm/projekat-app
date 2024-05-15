const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projekatmobilno'
});

connection.connect();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Serve static files
const staticPath = path.join(__dirname, 'www');
app.use(express.static(staticPath));

// Signup endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const userQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  const profileQuery = `INSERT INTO profiles (email, name) VALUES (?, ?)`;

  connection.query(userQuery, [name, email, password], (error, userResults, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(profileQuery, [email, name], (error, profileResults, fields) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const userQuery = `SELECT * FROM users WHERE email = ? AND password = ?`;
  const userProfileQuery = `SELECT * FROM profiles WHERE email = ?`;

  connection.query(userQuery, [email, password], (error, userResults, fields) => {
    if (error) {
      console.error('Error checking user credentials:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (userResults.length > 0) {
      // User found
      const user = userResults[0];

      connection.query(userProfileQuery, [email], (error, profileResults, fields) => {
        if (error) {
          console.error('Error checking user profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (profileResults.length > 0) {
          // Profile exists
          const userProfile = profileResults[0];
          const userData = { email: email, name: user.name, profile: userProfile };
          req.session.email = email; // Store user's email in the session

          res.status(200).json({ message: 'Login successful', user: userData });
          console.log(req.session.email);
        } else {
          // Profile doesn't exist, create it
          const userProfileData = { email: email, name: user.name };
          connection.query('INSERT INTO profiles SET ?', userProfileData, (error, insertResult, fields) => {
            if (error) {
              console.error('Error creating user profile:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            const userData = { email: email, name: user.name, profile: userProfileData };
            req.session.email = email; // Store user's email in the session
            res.status(200).json({ message: 'Login successful', user: userData });
            console.log(req.session.email);
          });
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

// Update profile endpoint
app.put('/profile', (req, res) => {
  const email = req.session.email; // Use email from the current session
  if (!email) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { name, address, city, postal_code, phone_number } = req.body;

  const updateProfileQuery = `
    UPDATE profiles
    SET name = ?, address = ?, city = ?, postal_code = ?, phone_number = ?
    WHERE email = ?`;

  connection.query(updateProfileQuery, [name, address, city, postal_code, phone_number, email], (error, results, fields) => {
    if (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// Checkout endpoint
app.post('/checkout', (req, res) => {
  const { cartItems, customer, paymentMethod, deliveryDate } = req.body;

  // Constructing the description of items in the order
  const description = cartItems.map(item => `${item.name} (${item.quantity})`).join(', ');

  const order = {
    description,
    name: customer.name,
    surname: customer.surname,
    address: customer.address,
    phone_number: customer.phone,
    date_of_delivery: new Date(deliveryDate),
    payment_method: paymentMethod
  };

  const query = `INSERT INTO orders (description, name, surname, address, phone_number, date_of_delivery, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [order.description, order.name, order.surname, order.address, order.phone_number, order.date_of_delivery, order.payment_method], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Order placed successfully' });
  });
});

module.exports = app;


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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

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

          // Send existing profile data to the client
          res.status(200).json({ message: 'Login successful', user: userData });
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

app.post('/checkout', (req, res) => {
  const { cartItems, customer, paymentMethod, deliveryDate } = req.body;

  // Constructing the description of items in the order
  const description = cartItems.map(item => `${item.name} (${item.quantity})`).join(', ');

  // Učitavanje e-pošte iz sesije
  const email = req.session.email;

  const order = {
    description,
    name: customer.name,
    surname: customer.surname,
    address: customer.address,
    phone_number: customer.phone,
    date_of_delivery: new Date(deliveryDate),
    payment_method: paymentMethod,
    email: email // Dodavanje e-pošte u objekat narudžbine
  };

  const query = `INSERT INTO orders (description, name, surname, address, phone_number, date_of_delivery, payment_method, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [order.description, order.name, order.surname, order.address, order.phone_number, order.date_of_delivery, order.payment_method, order.email], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Order placed successfully' });
  });
});


// Route to check if user profile exists by email
app.post('/checkUserByEmail', (req, res) => {
  const { email } = req.body;

  // Query to check if a user exists with the provided email
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;

  // Execute the query
  connection.query(checkUserQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If there are results, user exists; otherwise, it doesn't
    if (results.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  });
});

// Route to update user profile
app.put('/updateProfile', (req, res) => {
  const { email, address, city, postal_code, phone_number } = req.body;

  // Check if all required fields are provided
  if (!email || !address || !city || !postal_code || !phone_number) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  // Update query
  const updateProfileQuery = `
    UPDATE profiles
    SET address = ?, city = ?, postal_code = ?, phone_number = ?
    WHERE email = ?`;

  // Execute the query
  connection.query(updateProfileQuery, [address, city, postal_code, phone_number, email], (error, results, fields) => {
    if (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if any rows were affected
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Profile not found for the provided email' });
      return;
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Route to check if profile fields are filled
app.post('/checkProfileFields', (req, res) => {
  const { email } = req.body;

  // Query to check if a profile exists with the provided email
  const checkProfileQuery = `SELECT * FROM profiles WHERE email = ?`;

  // Execute the query
  connection.query(checkProfileQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If there are results, profile exists; otherwise, it doesn't
    if (results.length > 0) {
      const profile = results[0];
      // Check if all required fields are filled
      const allFieldsFilled = profile.address !== null && profile.city !== null && profile.postal_code !== null && profile.phone_number !== null;
      res.status(200).json({ exists: true, profile, allFieldsFilled });
    } else {
      res.status(200).json({ exists: false });
    }
  });
});

// Route to get orders by email
app.get('/orders/:email', (req, res) => {
  const email = req.params.email;
  const query = `SELECT * FROM orders WHERE email = ?`;

  connection.query(query, [email], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json(results);
  });
});

module.exports = app;


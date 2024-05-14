const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const path = require('path');

const port = 3000; // Definicija porta

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

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
app.use(cors()); // Enable CORS for all routes

// Serve static files
const staticPath = path.join(__dirname, 'www'); // Adjust path as needed
app.use(express.static(staticPath));



// NE DIRATI
// Signup endpoint
app.post('/register', (req, res) => {
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
// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  connection.query(query, [email, password], (error, results, fields) => {
    if (error) {
      console.error('Error checking user credentials:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // Pronađen je korisnik
      const user = results[0];
      const userProfileQuery = `SELECT * FROM profiles WHERE email = ?`;
      connection.query(userProfileQuery, [email], (error, profileResults, fields) => {
        if (error) {
          console.error('Error checking user profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        if (profileResults.length > 0) {
          // Profil već postoji
          const userProfile = profileResults[0];
          const userData = { ...user, profile: userProfile };
          res.status(200).json({ message: 'Login successful', user: userData });
        } else {
          // Profil ne postoji, treba ga kreirati
          const userProfileData = { email: email };
          connection.query('INSERT INTO profiles SET ?', userProfileData, (error, insertResult, fields) => {
            if (error) {
              console.error('Error creating user profile:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            const userData = { ...user, profile: userProfileData };
            res.status(200).json({ message: 'Login successful', user: userData });
          });
        }
      });

      localStorage.setItem('userEmail', email);
      console.log(email);

      res.status(200).json({ message: 'Login successful', user: { email: email } });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
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

app.post('/checkUserByEmail', (req, res) => {
  const { email } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;
  connection.query(query, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user by email:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) {
      res.status(200).json({ exists: true, message: 'User exists' });
    } else {
      res.status(200).json({ exists: false, message: 'User does not exist' });
    }
  });
});



// Update profile endpoint
app.post('/updateProfile', (req, res) => {
  const { userid, name, address, city, postal_code, email, phone_number } = req.body;
  const query = `UPDATE profiles SET name=?, address=?, city=?, postal_code=?, email=?, phone_number=? WHERE userid=?`;
  connection.query(query, [name, address, city, postal_code, email, phone_number, userid], (error, results, fields) => {
    if (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// Create profile endpoint
app.post('/profiles', (req, res) => {
  const { name, address, city, postal_code, email, phone_number } = req.body;

  // Check if email is provided and not null
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  // Check if profile already exists
  const checkProfileQuery = `SELECT * FROM profiles WHERE email = ?`;
  connection.query(checkProfileQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(400).json({ error: 'Profile already exists' });
      return;
    }

    // Profile does not exist, create new profile
    const createProfileQuery = `INSERT INTO profiles (name, address, city, postal_code, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, address, city, postal_code, email, phone_number];

    connection.query(createProfileQuery, values, (error, results, fields) => {
      if (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json({ message: 'Profile created successfully' });
    });
  });
});
// NE DIRATI

// Update profile endpoint
// Update profile endpoint
app.put('/profiles/:email', (req, res) => {
  const email = req.params.email;
  const { name, address, city, postal_code, phone_number } = req.body;

  // Check if profile exists
  const checkProfileQuery = `SELECT * FROM profiles WHERE email = ?`;
  connection.query(checkProfileQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If profile doesn't exist, create it
    if (results.length === 0) {
      const createProfileQuery = `INSERT INTO profiles (email, name, address, city, postal_code, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [email, name, address, city, postal_code, phone_number];

      connection.query(createProfileQuery, values, (error, results, fields) => {
        if (error) {
          console.error('Error creating profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(201).json({ message: 'Profile created successfully' });
      });
    } else {
      // Profile exists, update profile
      const updateProfileQuery = `UPDATE profiles SET name = ?, address = ?, city = ?, postal_code = ?, phone_number = ? WHERE email = ?`;
      const values = [name, address, city, postal_code, phone_number, email];

      connection.query(updateProfileQuery, values, (error, results, fields) => {
        if (error) {
          console.error('Error updating profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json({ message: 'Profile updated successfully' });
      });
    }
  });
});
// Update profile endpoint
app.put('/profiles/:email', (req, res) => {
  const email = req.params.email;
  const { name, address, city, postal_code, phone_number } = req.body;

  // Check if profile exists
  const checkProfileQuery = `SELECT * FROM profiles WHERE email = ?`;
  connection.query(checkProfileQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If profile doesn't exist, create it
    if (results.length === 0) {
      const createProfileQuery = `INSERT INTO profiles (email, name, address, city, postal_code, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [email, name, address, city, postal_code, phone_number];

      connection.query(createProfileQuery, values, (error, results, fields) => {
        if (error) {
          console.error('Error creating profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(201).json({ message: 'Profile created successfully' });
      });
    } else {
      // Profile exists, update profile
      const updateProfileQuery = `UPDATE profiles SET name = ?, address = ?, city = ?, postal_code = ?, phone_number = ? WHERE email = ?`;
      const values = [name, address, city, postal_code, phone_number, email];

      connection.query(updateProfileQuery, values, (error, results, fields) => {
        if (error) {
          console.error('Error updating profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json({ message: 'Profile updated successfully' });
      });
    }
  });
});


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

const port = 3000;

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

const staticPath = path.join(__dirname, 'www');
app.use(express.static(staticPath));


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
      req.session.email = email;
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});


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

      const user = userResults[0];

      connection.query(userProfileQuery, [email], (error, profileResults, fields) => {
        if (error) {
          console.error('Error checking user profile:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (profileResults.length > 0) {

          const userProfile = profileResults[0];
          const userData = { email: email, name: user.name, profile: userProfile };

          const userEmail = email;

          res.status(200).json({ message: 'Login successful', userEmail: userEmail, user: userData });
        } else {
          const userProfileData = { email: email, name: user.name };
          connection.query('INSERT INTO profiles SET ?', userProfileData, (error, insertResult, fields) => {
            if (error) {
              console.error('Error creating user profile:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            const userData = { email: email, name: user.name, profile: userProfileData };

            const userEmail = email;

            res.status(200).json({ message: 'Login successful', userEmail: userEmail, user: userData });
          });
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

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


app.post('/checkUserByEmail', (req, res) => {
  const { email } = req.body;

  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;


  connection.query(checkUserQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  });
});

app.put('/updateProfile', (req, res) => {
  const { email, address, city, postal_code, phone_number } = req.body;

  if (!email || !address || !city || !postal_code || !phone_number) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const updateProfileQuery = `
    UPDATE profiles
    SET address = ?, city = ?, postal_code = ?, phone_number = ?
    WHERE email = ?`;


  connection.query(updateProfileQuery, [address, city, postal_code, phone_number, email], (error, results, fields) => {
    if (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }


    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Profile not found for the provided email' });
      return;
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  });
});


app.post('/logout', (req, res) => {

  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});


app.post('/checkProfileFields', (req, res) => {
  const { email } = req.body;


  const checkProfileQuery = `SELECT * FROM profiles WHERE email = ?`;
  console.log(email);

  connection.query(checkProfileQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error checking user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }


    if (results.length > 0) {
      const profile = results[0];

      const allFieldsFilled = profile.address !== null && profile.city !== null && profile.postal_code !== null && profile.phone_number !== null;
      res.status(200).json({ exists: true, profile, allFieldsFilled });
    } else {
      res.status(200).json({ exists: false });
    }
  });
});


app.post('/checkout', (req, res) => {
  const { cartItems, customer, paymentMethod, deliveryDate, userEmail } = req.body;

  const email = userEmail;
  console.log('Email za order', email);
  if (!email) {

    return res.status(400).json({ error: 'User email is required' });
  }


  const description = cartItems.map(item => `${item.name} (${item.quantity})`).join(', ');

  const order = {
    description,
    name: customer.name,
    surname: customer.surname,
    address: customer.address,
    phone_number: customer.phone,
    date_of_delivery: new Date(deliveryDate),
    payment_method: paymentMethod,
    email: email
  };

  const query = `INSERT INTO orders (description, name, surname, address, phone_number, date_of_delivery, payment_method, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [order.description, order.name, order.surname, order.address, order.phone_number, order.date_of_delivery, order.payment_method, order.email], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json({ message: 'Order placed successfully' });
  });
});

app.get('/orders/:email', (req, res) => {
  const email = req.params.email; // Koristi email adresu iz URL parametra

  const query = `SELECT * FROM orders WHERE email = ?`;

  connection.query(query, [email], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

app.post('/getProfileDetails', (req, res) => {
  const { email } = req.body;


  const getProfileDetailsQuery = `SELECT * FROM profiles WHERE email = ?`;


  connection.query(getProfileDetailsQuery, [email], (error, results, fields) => {
    if (error) {
      console.error('Error getting profile details:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }


    if (results.length > 0) {
      const profileDetails = results[0];
      res.status(200).json({ message: 'Profile details retrieved successfully', profile: profileDetails });
    } else {
      res.status(404).json({ error: 'Profile not found for the provided email' });
    }
  });
});
app.post('/deleteOrders', (req, res) => {
  const { orderIds } = req.body;

  if (!orderIds || orderIds.length === 0) {
    return res.status(400).json({ error: 'No order IDs provided' });
  }

  const query = 'DELETE FROM orders WHERE orderid IN (?)';

  connection.query(query, [orderIds], (error, results) => {
    if (error) {
      console.error('Error deleting orders:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ message: 'Orders deleted successfully' });
  });
});


module.exports = app;


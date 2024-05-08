const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const path = require('path');

// Ostatak vašeg server koda ide ovdje

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

// Signup endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
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

app.post('/updateProfile', (req, res) => {
  const { userid, name, address, city, postal_code, email, phone_number } = req.body;

  // Construct the query to update the profile
  const query = `UPDATE user SET name=?, address=?, city=?, postal_code=?, email=?, phone_number=? WHERE userid=?`;

  // Execute the query with the provided values
  connection.query(query, [name, address, city, postal_code, email, phone_number, userid], (error, results, fields) => {
    if (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

app.post('/profiles', (req, res) => {
  const { name, address, city, postal_code, email, phone_number } = req.body;

  // Check if phone_number is provided and not null
  if (!phone_number) {
    res.status(400).json({ error: 'phone_number is required' });
    return;
  }

  // Construct the query to create a new profile
  const query = `INSERT INTO user (name, address, city, postal_code, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, address, city, postal_code, email, phone_number];

  // Execute the query with the provided values
  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Profile created successfully' });
  });
});


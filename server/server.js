const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware to handle CORS issues

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/projekatmobilno', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const corsOptions = {
  origin: 'http://localhost:8100', // Allow requests from Angular app running on port 8100
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  newUser.save()
    .then(() => {
      console.log('User registered successfully');
      res.status(200).send({ message: 'User registered successfully' });
    })
    .catch(error => {
      console.error('Error registering user:', error);
      res.status(500).send({ error: 'An error occurred while registering user' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

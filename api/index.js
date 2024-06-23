const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const TransactionModel = require('./models/transaction.js'); // Ensure the correct path to the transaction model
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB once when the server starts
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1); // Exit the process if unable to connect to the database
});

// Route to test API
app.get('/api/test', (req, res) => {
  res.json('test ok');
});

// Endpoint to handle POST requests for transactions
app.post('/api/transaction', async (req, res) => {
  try {
    // Accessing the request body to get transaction details
    const { name, price, description, datetime } = req.body;

    // Validate required fields
    if (!name || !price || !description || !datetime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the transaction
    const transaction = await TransactionModel.create({
      name,
      price,
      description,
      datetime,
    });

    // Respond with the created transaction
    res.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to handle GET requests for transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await TransactionModel.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const port = 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

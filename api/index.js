const { Hono } = require('hono');
const cors = require('cors');
const mongoose = require('mongoose');
const TransactionModel = require('./models/transaction.js'); // Ensure the correct path to the transaction model
require('dotenv').config();

const app = new Hono();

// Middleware
app.use(cors());
app.use(async (c, next) => {
  c.req.headers['content-type'] = 'application/json';
  await next();
});

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
app.get('/api/test', (c) => {
  return c.json({ message: 'test ok' });
});

// Endpoint to handle POST requests for transactions
app.post('/api/transaction', async (c) => {
  try {
    const { name, price, description, datetime } = await c.req.json();

    // Validate required fields
    if (!name || !price || !description || !datetime) {
      return c.json({ message: 'All fields are required' }, 400);
    }

    // Create the transaction
    const transaction = await TransactionModel.create({
      name,
      price,
      description,
      datetime,
    });

    // Respond with the created transaction
    return c.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return c.json({ message: 'Internal server error' }, 500);
  }
});

// Endpoint to handle GET requests for transactions
app.get('/api/transactions', async (c) => {
  try {
    const transactions = await TransactionModel.find();
    return c.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json({ message: 'Internal server error' }, 500);
  }
});

const port = 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

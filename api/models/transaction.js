const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the Transaction schema
const TransactionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    
  },
  datetime: {
    type: Date,
    required: [true, 'Datetime is required'],
   
  },
});


// Create the model from the schema
const TransactionModel = model('Transaction', TransactionSchema);

// Export the model
module.exports = TransactionModel;

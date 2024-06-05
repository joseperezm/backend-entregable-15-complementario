const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ticketSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => Math.random().toString(36).substr(2, 9)
  },
  purchase_datetime: { 
    type: Date, 
    default: Date.now
  },
  amount: { 
    type: Number, 
    required: true
  },
  purchaser: { 
    type: String, 
    required: true
  }
});

ticketSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único.' });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
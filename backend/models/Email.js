const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageId: { type: String, required: true, unique: true },
  threadId: { type: String },
  sender: { type: String, required: true },
  subject: { type: String },
  date: { type: Date, required: true },
  body: { type: String },
  snippet: { type: String },
  category: { 
    type: String, 
    enum: ['Shopping', 'Food', 'Travel', 'Work', 'Finance', 'Others'],
    default: 'Others'
  },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  isProcessed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);

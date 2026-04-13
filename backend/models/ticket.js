const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: null
  },
  acceptanceCriteria: [String],
  storyPoints: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
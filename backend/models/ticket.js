const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do'
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
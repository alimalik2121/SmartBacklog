const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/smartbacklog')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
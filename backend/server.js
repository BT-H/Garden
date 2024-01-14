const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a simple mongoose schema and model (you can customize this based on your application needs)
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Express route to get all items
app.get('/api/get', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Express route to add a new item
app.post('/api/post', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newItem = new Item({ name, description });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Set up the Express app to serve static assets (e.g., React build)
app.use(express.static('client/build'));

// Serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

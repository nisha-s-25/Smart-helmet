const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string
const uri = 'mongodb+srv://Nisha:Nisha@cluster0.kdc3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema with helmetBit, emergencyNumber, riderSafety, and location attributes
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  registerNumber: Number,
  yearOfStudy: Number,
  age: Number,
  department: String,
  emergencyNumber: { type: String, default: 'Not set' }, // Emergency number
  speed: { type: Number, default: 0 }, // Speed initialized to 0
  latitude: { type: Number, default: 0 }, // Latitude initialized to 0
  longitude: { type: Number, default: 0 }, // Longitude initialized to 0
  complaints: { type: [String], default: [] }, // Array of complaints
  helmetBit: { type: Number, default: 0 }, // Initialize helmetBit to 0
  riderSafety: { type: Number, default: 0 }, // Initialize riderSafety to 0
  location: { type: String, default: '' } // Initialize location as an empty string
});

// Models
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password, registerNumber, yearOfStudy, age, department, emergencyNumber } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ registerNumber });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    username,
    password: hashedPassword,
    registerNumber,
    yearOfStudy,
    age,
    department,
    emergencyNumber, // Add emergency number
    speed: 0, // Initialize speed to 0
    latitude: 0, // Initialize latitude to 0
    longitude: 0, // Initialize longitude to 0
    helmetBit: 0, // Initialize helmetBit to 0
    riderSafety: 0, // Initialize riderSafety to 0
    location: '' // Initialize location as an empty string
  });

  await newUser.save();
  res.json({ message: 'User registered successfully' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { registerNumber, password } = req.body;

  // Find user by register number
  const user = await User.findOne({ registerNumber });
  if (!user) return res.status(400).json({ message: 'User not found' });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token, message: 'Login successful' });
});

// User Info Route (including helmetBit, riderSafety, and complaints)
app.get('/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).send('Access denied.');

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(verified.userId);
    if (!user) return res.status(404).send('User not found.');

    res.json(user);
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
});

// Submit Complaint Route
app.post('/submit-complaint', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).send('Access denied.');

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    const { complaintText } = req.body;

    if (!complaintText || complaintText.trim().length === 0) {
      return res.status(400).json({ message: 'Complaint text cannot be empty.' });
    }

    // Update the user's complaints array
    const updatedUser = await User.findByIdAndUpdate(
      verified.userId,
      { $push: { complaints: complaintText } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found or update failed.' });

    res.json({ message: 'Complaint submitted successfully', updatedUser });
  } catch (error) {
    res.status(400).send('Invalid token or error processing the request.');
  }
});

// Fetch Complaints Route
app.get('/complaints', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).send('Access denied.');

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    
    const user = await User.findById(verified.userId);
    if (!user) return res.status(404).send('User not found.');

    res.json({ complaints: user.complaints });
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
});

// Update Helmet Bit and Rider Safety Route
app.post('/update-safety', async (req, res) => {
  try {
    const { helmetBit, riderSafety } = req.body;

    // Update the user's helmetBit and riderSafety values
    const updatedUser = await User.findByIdAndUpdate(
      verified.userId,
      { helmetBit, riderSafety },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found or update failed.' });

    res.json({ message: 'User safety information updated successfully', updatedUser });
  } catch (error) {
    res.status(400).send('Invalid token or error processing the request.');
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

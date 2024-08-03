const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
    console.log("------>")
  const { username, password } = req.body;
  console.log(" req.body", req.body)
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
    console.log("working")
  const { username, password } = req.body;
  console.log("req.body",req.body)
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

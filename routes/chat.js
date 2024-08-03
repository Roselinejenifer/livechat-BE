const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Adjust path as needed
const authenticate = require('../middleware/authMiddleware'); // Adjust path as needed

// Get all messages - Protected route
router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    console.log('Fetched messages:', messages); // Debug log
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send a new message - Protected route
router.post('/', authenticate, async (req, res) => {
  const { text } = req.body;
  console.log("---><",req.body)
  const sender = req.user.username;

  if (!text) {
    return res.status(400).json({ msg: 'Message text is required' });
  }

  console.log('Sender:', sender);
  console.log('Message text:', text);

  try {
    const newMessage = new Message({ text, sender });
    await newMessage.save();
    res.status(201).json({ msg: 'Message sent' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Adjust path as needed

// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     console.log('Authorization header missing or incorrect format');
//     return res.status(401).json({ msg: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');

//     if (!req.user) {
//       console.log('User not found');
//       return res.status(401).json({ msg: 'Unauthorized' });
//     }

//     console.log('User authenticated:', req.user.username);
//     next();
//   } catch (err) {
//     console.error('Authentication error:', err);
//     res.status(401).json({ msg: 'Unauthorized' });
//   }
// };

// module.exports = authenticate;

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization header missing or incorrect format');
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('User not found');
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Attach username to request object
    req.username = decoded.username;

    console.log(".......>",decoded.username)

    console.log('User authenticated:', req.user.username);
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ msg: 'Unauthorized' });
  }
};

module.exports = authenticate;


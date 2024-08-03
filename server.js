// const express = require('express');
// const mongoose = require('mongoose');

// const authRoutes = require('./routes/auth');
// const chatRoutes = require('./routes/chat'); // Make sure this path is correct
// const app = express();
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// require('dotenv').config();

// mongoose.connect('mongodb+srv://Jas-13:123@jasper.cclnzjl.mongodb.net/livechat?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

//   const server = http.createServer(app);
//   const io = new Server(server, {
//     cors: {
//       origin: '*', // Allow connections from any origin
//     },
//   });
  

// app.use(express.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/chat', chatRoutes); // Register chat routes
//  app.get('/',(req,res)=>{res.status(200).send({message:"server connected"})})
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('message', (data) => {
//     console.log('message:', data);
//     io.emit('message', data); // Broadcast the message to all clients
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat'); // Make sure this path is correct

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
   origin: '*', // Allow all origins, or specify the origin of your frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  },
});
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes); // Register chat routes
app.get('/', (req, res) => { res.status(200).send({ message: "server connected" }) });

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message received', newMessageRecieved);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.off('setup', (userData) => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


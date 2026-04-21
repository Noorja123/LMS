require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const path = require('path');

// Init Middleware
app.use(express.json());
app.use(cors());

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Core Routes
app.get('/', (req, res) => res.send('Smart LMS API Running'));

// Future Routes Here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lectures', require('./routes/lectures'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/upload', require('./routes/upload'));
// Socket.io integration
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_course', (courseId) => {
    socket.join(courseId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Attach io to the app for use in controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

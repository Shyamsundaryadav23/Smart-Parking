require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const slotRoutes = require('./routes/slotRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// mount routes under /api namespace
app.use('/api/auth', authRoutes);
app.use('/api', parkingRoutes);
app.use('/api', reservationRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// health check
app.get('/health', (req, res) => res.send('OK'));

const http = require('http');
const { startWatcher } = require('./services/expiryService');
const { init } = require('./socket');

const PORT = process.env.PORT || 5000;

// create http server so we can attach socket.io
const server = http.createServer(app);
const io = init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // start periodic expiration checks once server is running
  startWatcher();
});
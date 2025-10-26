require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

// Replace direct requires with a safe loader to avoid crashes when route files are missing
function loadRoute(relativePath, fallbackMessage) {
	// relativePath example: './src/routes/medicine.routes'
	const fullPath = path.join(__dirname, relativePath);
	let routeModule = null;
	try {
		// try .js file first, then as folder index
		if (fs.existsSync(fullPath + '.js') || fs.existsSync(fullPath)) {
			routeModule = require(fullPath);
		}
	} catch (err) {
		console.error(`Error requiring route ${relativePath}:`, err.message);
	}
	if (!routeModule) {
		// return a router that responds with 501 for all methods to avoid crashing
		const express = require('express');
		const r = express.Router();
		r.use((req, res) => {
			res.status(501).json({
				success: false,
				message: fallbackMessage || 'Not implemented'
			});
		});
		return r;
	}
	return routeModule;
}

// Import routes
const authRoutes = loadRoute('./src/routes/auth.routes', 'Auth routes not implemented');
const medicineRoutes = loadRoute('./src/routes/medicine.routes', 'Medicine routes not implemented');
const cartRoutes = loadRoute('./src/routes/cart.routes', 'Cart routes not implemented');
const orderRoutes = loadRoute('./src/routes/order.routes', 'Order routes not implemented');
const addressRoutes = loadRoute('./src/routes/address.routes', 'Address routes not implemented');
const paymentRoutes = loadRoute('./src/routes/payment.routes', 'Payment routes not implemented');
const prescriptionRoutes = loadRoute('./src/routes/prescription.routes', 'Prescription routes not implemented');
const userRoutes = loadRoute('./src/routes/user.routes', 'User routes not implemented');
const adminRoutes = loadRoute('./src/routes/admin.routes', 'Admin routes not implemented');
//const labTestRoutes = loadRoute('./src/routes/labTest.routes', 'Lab test routes not implemented');
//const consultationRoutes = loadRoute('./src/routes/consultation.routes', 'Consultation routes not implemented');
const wishlistRoutes = loadRoute('./src/routes/wishlist.routes', 'Wishlist routes not implemented');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediquick')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('⚠️ Application will continue without database connection. Some features may not work.');
    // Don't exit the process, let the application continue
  });

// Add connection event listeners for better error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});


// Socket.IO for real-time features
global.io = io;
io.on('connection', (socket) => {
  console.log('🔗 New client connected:', socket.id);

  // Join order room for real-time updates
  socket.on('joinOrder', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`User joined order room: order_${orderId}`);
  });

  // Join user room for notifications
  socket.on('joinUser', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined personal room: user_${userId}`);
  });

  // Leave rooms on disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MediQuick Backend API',
    status: 'Active',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      medicines: '/api/medicines',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
//app.use('/api/lab-tests', labTestRoutes);
//app.use('/api/consultations', consultationRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
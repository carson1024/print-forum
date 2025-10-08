const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const config = require('./config');

// Import wallet routes
const walletRoutes = require('./wallet/walletRoutes');

// Import cron service
const CronService = require('./cron/cronService');

const app = express();
const PORT = config.server.port;
const NODE_ENV = config.server.nodeEnv;

// Initialize cron service
const cronService = new CronService();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));
app.use(compression());
app.use(morgan(config.logging.format));
app.use(express.json({ limit: config.api.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.api.maxRequestSize }));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    features: {
      walletCreation: config.features.enableWalletCreation,
      copyTrading: config.features.enableCopyTrading,
      notifications: config.features.enableNotifications
    },
    cron: cronService.getStatus()
  });
});

// Use wallet routes
app.use('/api/wallet', walletRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'build')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl 
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  cronService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  cronService.stop();
  process.exit(0);
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 App: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${NODE_ENV}`);
    
    // Start cron service
    cronService.start();
    console.log(`⏰ Cron service started`);
  });
}

module.exports = app;

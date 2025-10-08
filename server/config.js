const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * Centralized configuration management for the server
 * Handles all environment variables and provides defaults
 */

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    timezone: process.env.TZ || 'UTC'
  },

  // Database Configuration (Supabase)
  database: {
    // Prefer server-side envs; fallback to REACT_APP_* for local/dev compatibility
    url: process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY,
  },

  // Solana Configuration
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    network: process.env.SOLANA_NETWORK || 'mainnet-beta',
    commitment: process.env.SOLANA_COMMITMENT || 'confirmed',
    timeout: parseInt(process.env.SOLANA_TIMEOUT) || 30000,
  },

  // Wallet Configuration
  wallet: {
    encryptionKey: process.env.WALLET_ENCRYPTION_KEY,
    defaultWalletName: process.env.DEFAULT_WALLET_NAME || 'Copy Trading Wallet',
    maxWalletsPerUser: parseInt(process.env.MAX_WALLETS_PER_USER) || 1,
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },

  // API Configuration
  api: {
    version: process.env.API_VERSION || 'v1',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
    timeout: parseInt(process.env.API_TIMEOUT) || 30000,
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    enableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
    enableFile: process.env.LOG_ENABLE_FILE === 'true',
    filePath: process.env.LOG_FILE_PATH || './logs/server.log',
  },

  // External Services
  external: {
    // Jupiter API for price data
    jupiterApiUrl: process.env.JUPITER_API_URL || 'https://api.jup.ag',
    jupiterTimeout: parseInt(process.env.JUPITER_TIMEOUT) || 10000,
    
    // Other external APIs
    coinGeckoApiUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    coinGeckoTimeout: parseInt(process.env.COINGECKO_TIMEOUT) || 10000,
  },

  // Copy Trading Configuration
  copyTrading: {
    maxCopyAmount: parseFloat(process.env.MAX_COPY_AMOUNT) || 1.0, // SOL
    minCopyAmount: parseFloat(process.env.MIN_COPY_AMOUNT) || 0.01, // SOL
    defaultSlippage: parseFloat(process.env.DEFAULT_SLIPPAGE) || 0.5, // 0.5%
    maxSlippage: parseFloat(process.env.MAX_SLIPPAGE) || 5.0, // 5%
    copyDelayMs: parseInt(process.env.COPY_DELAY_MS) || 1000, // 1 second
  },

  // Feature Flags
  features: {
    enableWalletCreation: process.env.ENABLE_WALLET_CREATION !== 'false',
    enableCopyTrading: process.env.ENABLE_COPY_TRADING !== 'false',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',
  },

  // Redis Configuration (if using Redis for caching)
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0,
    ttl: parseInt(process.env.REDIS_TTL) || 3600, // 1 hour
  },

  // Email Configuration (if using email notifications)
  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@printforum.com',
  },
};

/**
 * Get configuration for a specific environment
 */
function getEnvironmentConfig() {
  const env = config.server.nodeEnv;
  
  switch (env) {
    case 'production':
      return {
        ...config,
        server: {
          ...config.server,
          corsOrigin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
        },
        logging: {
          ...config.logging,
          level: 'warn',
          enableConsole: false,
        },
        features: {
          ...config.features,
          enableAnalytics: true,
        },
      };
    
    case 'staging':
      return {
        ...config,
        server: {
          ...config.server,
          corsOrigin: process.env.CORS_ORIGIN || 'https://staging.yourdomain.com',
        },
        logging: {
          ...config.logging,
          level: 'info',
        },
      };
    
    case 'test':
      return {
        ...config,
        server: {
          ...config.server,
          port: process.env.PORT || 5001,
        },
        database: {
          ...config.database,
          url: process.env.SUPABASE_TEST_URL || config.database.url,
        },
        logging: {
          ...config.logging,
          level: 'error',
          enableConsole: false,
        },
      };
    
    default: // development
      return config;
  }
}

/**
 * Get a specific configuration value
 */
function get(key, defaultValue = null) {
  const keys = key.split('.');
  let value = getEnvironmentConfig();
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }
  
  return value;
}

/**
 * Check if a feature is enabled
 */
function isFeatureEnabled(feature) {
  return get(`features.${feature}`, false);
}

/**
 * Get database connection string
 */
function getDatabaseUrl() {
  return get('database.url');
}

/**
 * Get Solana RPC URL
 */
function getSolanaRpcUrl() {
  return get('solana.rpcUrl');
}

/**
 * Get wallet encryption key
 */
function getWalletEncryptionKey() {
  return get('wallet.encryptionKey');
}

module.exports = {
  ...getEnvironmentConfig(),
  get,
  isFeatureEnabled,
  getDatabaseUrl,
  getSolanaRpcUrl,
  getWalletEncryptionKey,
};
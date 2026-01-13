import cors from 'cors';
import { AppConfig } from '../utils/config';

/**
 * CORS Configuration
 * Security-focused CORS setup for production deployment
 */

const getAllowedOrigins = (): string[] => {
  const corsOrigin = AppConfig.corsOrigin;

  if (Array.isArray(corsOrigin)) {
    return corsOrigin;
  }

  if (typeof corsOrigin === 'string' && corsOrigin.includes(',')) {
    return corsOrigin.split(',').map(origin => origin.trim());
  }

  return [corsOrigin];
};

const isOriginAllowed = (origin: string | undefined, allowedOrigins: string[]): boolean => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  if (AppConfig.isDevelopment) {
    const localhostOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];

    if (localhostOrigins.includes(origin)) return true;

    // Allow any localhost with common dev ports
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        const port = parseInt(url.port);
        if (port >= 3000 && port <= 9999) return true;
      }
    } catch {
      // Invalid URL, reject
      return false;
    }
  }

  return false;
};

const allowedOrigins = getAllowedOrigins();

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin, allowedOrigins)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked origin: ${origin}`);
      callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
    }
  },

  // Only allow credentials for HTTPS in production
  credentials: AppConfig.isProduction ? true : true, // Allow credentials in both env for flexibility

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Client-Version',
    'X-Requested-With'
  ],

  maxAge: AppConfig.isProduction ? 3600 : 600,

  optionsSuccessStatus: 200 
};

// if (AppConfig.isDevelopment) {
//   console.log('🔒 CORS Configuration:');
//   console.log(`   Allowed Origins: ${allowedOrigins.join(', ')}`);
//   console.log(`   Credentials: ${corsOptions.credentials}`);
//   console.log(`   Environment: ${AppConfig.nodeEnv}`);
// }

export default cors(corsOptions);

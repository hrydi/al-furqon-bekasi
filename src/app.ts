import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import corsMiddleware from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api';
import { AppConfig } from './utils/config';

config();

const app = express();
const PORT = AppConfig.port;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(corsMiddleware);
app.use((req, res, next) => {
  const now = new Date().toISOString();
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    next();
  });
}

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Al-Furqon Backend is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Main API routes - without /v1 prefix
app.use('/api', apiRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    path: req.originalUrl,
    method: req.method
  });
});

app.use(errorHandler);

export default app;

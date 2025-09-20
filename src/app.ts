import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import corsMiddleware from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(corsMiddleware);
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
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

app.use('/api/v1', apiRoutes);
app.use('/articles', (req, res, next) => {
  req.url = '/articles' + (req.url === '/' ? '' : req.url);
  apiRoutes(req, res, next);
});

app.use('/donations', (req, res, next) => {
  req.url = '/donations' + (req.url === '/' ? '' : req.url);
  apiRoutes(req, res, next);
});

app.use('/news', (req, res, next) => {
  req.url = '/news' + (req.url === '/' ? '' : req.url);
  apiRoutes(req, res, next);
});

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

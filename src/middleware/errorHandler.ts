import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';


export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  console.error('💥 Error occurred:', error);

  let statusCode = 500;
  let message = 'Terjadi kesalahan server internal';
  let errorDetails = null;

  if (error.code === 'P2002') {
    statusCode = 400;
    message = 'Data sudah ada';
    errorDetails = 'DUPLICATE_ENTRY';
  } else if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Data tidak ditemukan';
    errorDetails = 'NOT_FOUND';
  } else if (error.code === 'P2003') {
    statusCode = 400;
    message = 'Violasi constraint foreign key';
    errorDetails = 'FOREIGN_KEY_CONSTRAINT';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Data tidak valid';
    errorDetails = error.details?.map((detail: any) => detail.message).join(', ');
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid';
    errorDetails = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token sudah kadaluarsa';
    errorDetails = 'EXPIRED_TOKEN';
  }

  if (error.message.includes('CORS') || error.message.includes('Not allowed by CORS')) {
    statusCode = 403;
    message = 'CORS policy violation';
    errorDetails = 'CORS_ERROR';
  }

  if (error.message.includes('Too many requests')) {
    statusCode = 429;
    message = 'Terlalu banyak permintaan';
    errorDetails = 'RATE_LIMIT_EXCEEDED';
  }

  if (error.statusCode) {
    statusCode = error.statusCode;
  }

  if (error.message && !error.code) {
    message = error.message;
  }

  const response = ApiResponse.error(message, errorDetails, statusCode);
  
  res.status(statusCode).json(response);
}

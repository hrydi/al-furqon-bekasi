import { Response } from 'express';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  error: string | null;
}

export const responseHelper = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
  error: Error | string | null = null
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
    message,
    data,
    error: error instanceof Error ? error.message : error
  });
};
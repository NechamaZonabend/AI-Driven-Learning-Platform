import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '../backend_types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Check if it's our custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.message) {
    message = error.message;
    
    // Handle specific error types
    if (error.message.includes('User with this phone number already exists')) {
      statusCode = 409; // Conflict
    } else if (error.message.includes('Invalid phone number or password')) {
      statusCode = 401; // Unauthorized
    } else if (error.message.includes('not found')) {
      statusCode = 404; // Not Found
    } else if (error.message.includes('validation')) {
      statusCode = 400; // Bad Request
    }
  }

  // Log error
  logger.error(`Error ${statusCode}: ${message}`, {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Send error response
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
  };

  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
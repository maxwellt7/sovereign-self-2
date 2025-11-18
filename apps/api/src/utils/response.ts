import { Response } from 'express';
import { ApiResponse } from '@sovereign-self/shared';

export const successResponse = <T>(res: Response, data: T, statusCode = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 400,
  code?: string
): void => {
  const response: ApiResponse<never> = {
    success: false,
    error: {
      message,
      code,
    },
  };
  res.status(statusCode).json(response);
};


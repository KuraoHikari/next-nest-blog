import express from 'express';

declare global {
  namespace Express {
    interface Request {
      public?: Record<string, any>;
    }
  }
}

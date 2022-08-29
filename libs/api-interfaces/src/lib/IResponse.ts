import { Response } from 'express';

export interface IResponse extends Response {
  message?: string;
  data?: unknown;
  code?: number;
}

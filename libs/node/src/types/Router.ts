import { Router } from 'express';

export interface IRouter extends Router {
  descriptor: (text: string) => void;
}

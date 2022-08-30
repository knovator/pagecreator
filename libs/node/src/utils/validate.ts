import { ValidationError } from 'joi';
import { NextFunction } from 'express';
import { IRequest, IResponse } from './../types';

import { defaults } from './defaults';
import { inValidParam, failureResponse } from './responseHandlers';

const validate = (validator: any) => {
  return async function (req: IRequest, res: IResponse, next: NextFunction) {
    try {
      req.body = await validator.validateAsync(req.body);
      next();
    } catch (err) {
      defaults.logger.error('ValidationError', err);
      if ((err as ValidationError).isJoi)
        inValidParam((err as Error).message, res);
      else failureResponse((err as Error).message, res);
    }
  };
};

export default validate;

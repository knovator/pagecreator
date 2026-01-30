import mongoose from 'mongoose';
import { NextFunction } from 'express';
import { CollectionItem, IConfig, IRequest, IResponse } from '../types';
import { RESPONSE_CODES, internalServerError, validationError ,  REGEXS } from '../constants';

export const defaults: IConfig = {
  logger: console as any,
  getModals: () => mongoose.models,
  catchAsync:
    (fn: any, modal = '') =>
    (req: IRequest, res: IResponse, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        let message = (err as Error).message;
        if (message.match(REGEXS.OBJECTID_CAST_FAILED)) {
          message = `${modal} not found with given id!`;
        } else if(message.match(REGEXS.IS_AVAILABLE)) {
          return res.status(validationError).json({
            code: RESPONSE_CODES.VALIDATION_FAILED,
            message,
            data: undefined,
          });
        }
        // this.logger.error(err.message);
        return res.status(internalServerError).json({
          code: RESPONSE_CODES.ERROR,
          message,
          data: undefined,
        });
      });
    },
  collections: [] as CollectionItem[],
  customWidgetTypes: [],
  redis: undefined,
  languages: [],
};

export const commonExcludedFields = {
  __v: 0,
  isDeleted: 0,
  deletedAt: 0,
};

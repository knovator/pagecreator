import { NextFunction } from 'express';
import { CollectionItem, IConfig, IRequest, IResponse } from '../types';
import { RESPONSE_CODES, internalServerError, REGEXS } from '../constants';

export const defaults: IConfig = {
  logger: console as any,
  catchAsync:
    (fn: any, modal = '') =>
    (req: IRequest, res: IResponse, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        let message = (err as Error).message;
        if (message.match(REGEXS.OBJECTID_CAST_FAILED)) {
          message = `${modal} not found with given id!`;
        }
        // this.logger.error(err.message);
        res.status(internalServerError).json({
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

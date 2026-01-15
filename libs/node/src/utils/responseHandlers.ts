import {
  RESPONSE_CODES,
  validationError,
  success,
  create,
  notFoundError,
} from '../constants';
import { IResponse } from '../types';

export const failureResponse = (data: any, res: IResponse) => {
  let i = 0;
  if (data.name === 'ValidationError') {
    Object.keys(data.errors).forEach((key) => {
      if (i !== 1) {
        data.message = data.errors[key].message;
      }
      i++;
    });
  }
  res.message = data.message;
  return res.status(validationError).json({
    code: RESPONSE_CODES.ERROR,
    message: data.message ? data.message : data,
  });
};

export const successResponse = (data: any, res: IResponse) => {
  return res.status(success).json({
    code: RESPONSE_CODES.DEFAULT,
    message: res.message,
    data: data,
  });
};

export const createdDocumentResponse = (data: any, res: IResponse) => {
  return res.status(create).json({
    code: RESPONSE_CODES.DEFAULT,
    message: res.message,
    data: data,
  });
};

export const recordNotFound = (res: IResponse) => {
  return res.status(notFoundError).json({
    code: RESPONSE_CODES.ERROR,
    message: res.message,
    data: {},
  });
};

export const inValidParam = (message: any, res: IResponse) => {
  /* eslint-disable no-useless-escape */
  message = message.replace(/\"/g, '');
  res.message = message;
  return res.status(validationError).json({
    code: RESPONSE_CODES.ERROR,
    message: message,
    data: undefined,
  });
};

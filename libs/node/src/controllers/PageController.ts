import { Types } from 'mongoose';
import { Page } from './../models';
import { create, remove, update, list } from '../services/dbService';
import {
  successResponse,
  createdDocumentResponse,
} from './../utils/responseHandlers';
import { IRequest, IResponse } from '@pagecreator/api-interfaces';

import { defaults } from '../utils/defaults';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Page');
};

export const createPage = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const page = await create(Page, data);
  res.message = req?.i18n?.t('page.create');
  return createdDocumentResponse(page, res);
});

export const updatePage = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const _id = req.params['id'];
  const updatedPage = await update(Page, { _id }, data);
  res.message = req?.i18n?.t('page.update');
  return successResponse(updatedPage, res);
});

export const deletePage = catchAsync(async (req: IRequest, res: IResponse) => {
  const _id = new Types.ObjectId(req.params['id']);
  const createdPage = await remove(Page, { _id });
  res.message = req?.i18n?.t('page.delete');
  return successResponse(createdPage, res);
});

export const getPages = catchAsync(async (req: IRequest, res: IResponse) => {
  const search = req.body.search || '';
  const { page, limit, populate } = req.body.options;
  const customOptions = {
    populate,
    ...(page && limit ? { page, limit } : {}),
  };
  const query = {
    isDeleted: false,
    $or: [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        code: {
          $regex: search,
          $options: 'i',
        },
      },
    ],
  };
  const pages = await list(Page, query, customOptions);
  res.message = req?.i18n?.t('page.getAll');
  return successResponse(pages, res);
});

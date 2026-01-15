import { Types } from 'mongoose';
import { create, remove, update, list , checkUnique } from '../services/dbService';
import {
  successResponse,
  createdDocumentResponse,
} from './../utils/responseHandlers';
import { IRequest, IResponse } from '../types';
import { defaults } from '../utils/defaults';
import { updateRedisPage } from '../services/dataService';
import { VALIDATION } from '../constants';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Page');
};
const getModals = (req: IRequest) => defaults.getModals(req);

export const createPage = catchAsync(async (req: IRequest, res: IResponse) => {
  const { Page } = getModals(req);
  const data = req.body;

  await checkUnique({
    Modal: Page,
    uniqueField: 'code',
    value: data.code,
    errorMessage: VALIDATION.WIDGET_EXISTS
  });
 
  await checkUnique({
    Modal: Page,
    uniqueField: 'slug',
    value: data.slug,
    errorMessage: VALIDATION.SLUG_EXISTS
  });
  const page = await create(Page, data);
  res.message = req?.i18n?.t('page.create');
  return createdDocumentResponse(page, res);
});

export const updatePage = catchAsync(async (req: IRequest, res: IResponse) => {
  const models = getModals(req);
  const data = req.body;
  const _id = req.params['id'];
  const updatedPage = await update(models['Page'], { _id }, data);
  res.message = req?.i18n?.t('page.update');
  if (updatedPage) updateRedisPage(updatedPage.code, models); // update redis
  return successResponse(updatedPage, res);
});

export const deletePage = catchAsync(async (req: IRequest, res: IResponse) => {
  const { Page } = getModals(req);
  const _id = new Types.ObjectId(req.params['id']);
  const createdPage = await remove(Page, { _id });
  res.message = req?.i18n?.t('page.delete');
  return successResponse(createdPage, res);
});

export const getPages = catchAsync(async (req: IRequest, res: IResponse) => {
  const { Page } = getModals(req);
  const search = req.body.search || '';
  const { page, limit, populate, sort } = req.body.options;
  const customOptions = {
    populate,
    sort,
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const pages = await list(Page, query, customOptions);
  res.message = req?.i18n?.t('page.getAll');
  return successResponse(pages, res);
});

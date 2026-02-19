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
  const data = {
    ...req.body,
    ...req.defaultStoreFields,
  };

  await checkUnique({
    Modal: Page,
    uniqueField: 'code',
    value: data.code,
    query: req.defaultQueryFields,
    errorMessage: VALIDATION.WIDGET_EXISTS
  });
 
  await checkUnique({
    Modal: Page,
    uniqueField: 'slug',
    value: data.slug,
    query: req.defaultQueryFields,
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
  const query = {
    _id,
    ...req.defaultQueryFields,
  };
  const updatedPage = await update(models['Page'], query, data);
  res.message = req?.i18n?.t('page.update');
  if (updatedPage) updateRedisPage(updatedPage.code, models); // update redis
  return successResponse(updatedPage, res);
});

export const deletePage = catchAsync(async (req: IRequest, res: IResponse) => {
  const { Page } = getModals(req);
  const _id = new Types.ObjectId(req.params['id']);
  const query = {
    _id,
    ...req.defaultQueryFields,
  };
  const deletedPage = await remove(Page, query);
  res.message = req?.i18n?.t('page.delete');
  return successResponse(deletedPage, res);
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
    ...req.defaultQueryFields,
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

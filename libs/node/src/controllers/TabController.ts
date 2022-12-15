import { Types } from 'mongoose';
import { Tab } from './../models';
import { create, remove, update, getAll } from '../services/dbService';
import {
  successResponse,
  createdDocumentResponse,
} from './../utils/responseHandlers';

import { defaults } from '../utils/defaults';
import { IRequest, IResponse } from '../types';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Tab');
};

export const createTab = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const tab = await create(Tab, data);
  res.message = req?.i18n?.t('tab.create');
  return createdDocumentResponse(tab, res);
});

export const updateTab = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const _id = req.params['tabId'];
  const updatedTab = await update(Tab, { _id }, data);
  res.message = req?.i18n?.t('tab.update');
  return successResponse(updatedTab, res);
});

export const deleteTab = catchAsync(async (req: IRequest, res: IResponse) => {
  const _id = new Types.ObjectId(req.params['tabId']);
  const deletedTab = await remove(Tab, { _id });
  res.message = req?.i18n?.t('tab.delete');
  return successResponse(deletedTab, res);
});

export const getTabs = catchAsync(async (req: IRequest, res: IResponse) => {
  const widgetId = new Types.ObjectId(req.params['widgetId']);
  const tab = await getAll(Tab, { widgetId });
  res.message = req?.i18n?.t('tab.getAll');
  return successResponse(tab, res);
});

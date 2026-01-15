import { getRedisValue, setRedisValue } from '../utils/redis';
import { successResponse, recordNotFound } from './../utils/responseHandlers';
import { defaults } from '../utils/defaults';
import { IRequest, IResponse } from '../types';
import { getPageDataDB, getWidgetDataDB } from '../services/dataService';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'User');
};

const getModals = (req: IRequest) => defaults.getModals(req);

// TO Do: Optimize the following
export const getWidgetData = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const models = getModals(req);
    const { fresh } = req.query;
    const { code } = req.body;
    let widgetData = await getRedisValue(`widgetData_${code}`);
    if (widgetData && fresh !== 'true') {
      return successResponse(widgetData, res);
    }
    widgetData = await getWidgetDataDB(code, models);

    if (!widgetData) {
      res.message = req?.i18n?.t('user.widgetNotFound');
      return recordNotFound(res);
    }

    await setRedisValue(`widgetData_${code}`, widgetData);

    return successResponse(widgetData, res);
  }
);

// TO Do: Optimize the following
export const getPageData = catchAsync(async (req: IRequest, res: IResponse) => {
  const models = getModals(req);
  const { fresh } = req.query;
  let code = req.body.code;
  const slug = req.body.slug;
  const { Page } = models;
  if (slug) {
    const page = await Page.findOne({ slug });
    if (!page) {
      res.message = req?.i18n?.t('user.pageNotFound');
      return recordNotFound(res);
    }
    code = page.code;
  }
  let pageData = await getRedisValue(`pageData_${code}`);
  if (pageData && fresh !== 'true') {
    return successResponse(pageData, res);
  }
  try {
    pageData = await getPageDataDB(code, models);
    console.log(code);
  } catch (error) {
    console.log(error);
  }

  if (!pageData) {
    res.message = req?.i18n?.t('user.pageNotFound');
    return recordNotFound(res);
  }
  await setRedisValue(`pageData_${code}`, pageData);

  return successResponse(pageData, res);
});

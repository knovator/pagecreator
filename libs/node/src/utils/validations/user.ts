import joi from 'joi';

export const getWidgetData = joi.object({
  code: joi.string().required(),
});

export const getPageData = joi.object({
  code: joi.string().required(),
});

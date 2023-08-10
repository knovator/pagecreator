import joi from 'joi';
import { ITabSchema, IDefaultValidations } from '../../types';

type TabValidation = ITabSchema & IDefaultValidations;

export const create = joi.object<TabValidation>({
  name: joi.string().optional(),
  names: joi.object().optional(),
  widgetId: joi.string().required(),
  collectionItems: joi.array().items(joi.string()).optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const update = joi.object<TabValidation>({
  name: joi.string().optional(),
  names: joi.object().optional(),
  widgetId: joi.string().optional(),
  collectionItems: joi.array().items(joi.string()).optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

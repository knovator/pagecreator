import joi from 'joi';
import { IItemSchema, IDefaultValidations, ItemTypes } from '../../types';

type ItemValidation = IItemSchema & IDefaultValidations;

const srcset = joi.object().keys({
  screenSize: joi.number().required(),
  width: joi.number().required(),
  height: joi.number().required(),
});

export const create = joi.object<ItemValidation>({
  widgetId: joi.string().required(),
  title: joi.string().required(),
  altText: joi.string().optional(),
  link: joi.string().required(),
  sequence: joi.number().optional(),
  srcset: joi.array().items(srcset),
  img: joi.string().allow(null).optional(),
  itemType: joi
    .string()
    .valid(...Object.values(ItemTypes))
    .optional()
    .default(ItemTypes.Web),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const update = joi.object<ItemValidation>({
  widgetId: joi.string().required(),
  title: joi.string().required(),
  altText: joi.string().optional(),
  link: joi.string().required(),
  sequence: joi.number().optional(),
  img: joi.string().allow(null).optional(),
  srcset: joi.array().items(srcset),
  itemType: joi
    .string()
    .valid(...Object.values(ItemTypes))
    .optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const list = joi.object({
  search: joi.string().allow('').replace(/\s+/g, '_').default(''),
});

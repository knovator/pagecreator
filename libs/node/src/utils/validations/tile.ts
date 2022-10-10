import joi from 'joi';
import { ITileSchema, IDefaultValidations, TileTypes } from '../../types';

type TileValidation = ITileSchema & IDefaultValidations;

const srcset = joi.object().keys({
  screenSize: joi.number().required(),
  width: joi.number().required(),
  height: joi.number().required(),
});

export const create = joi.object<TileValidation>({
  widgetId: joi.string().required(),
  title: joi.string().required(),
  altText: joi.string().optional(),
  link: joi.string().required(),
  sequence: joi.number().optional(),
  srcset: joi.array().items(srcset),
  img: joi.string().allow(null).optional(),
  tileType: joi
    .string()
    .valid(...Object.values(TileTypes))
    .optional()
    .default(TileTypes.Web),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const update = joi.object<TileValidation>({
  widgetId: joi.string().required(),
  title: joi.string().required(),
  altText: joi.string().optional(),
  link: joi.string().required(),
  sequence: joi.number().optional(),
  img: joi.string().allow(null).optional(),
  srcset: joi.array().items(srcset),
  tileType: joi
    .string()
    .valid(...Object.values(TileTypes))
    .optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const list = joi.object({
  search: joi.string().allow('').replace(/\s+/g, '_').default(''),
});

import joi from 'joi';
import { ITileSchema, TileTypes } from '@pagecreator/api-interfaces';

export const create = joi.object<ITileSchema>({
  widgetId: joi.string().required(),
  title: joi.string().required(),
  altText: joi.string().optional(),
  link: joi.string().required(),
  sequence: joi.number().optional(),
  img: joi.string().optional(),
  tileType: joi
    .string()
    .valid(...Object.values(TileTypes))
    .optional()
    .default(TileTypes.Web),
});

export const update = joi.object<ITileSchema>({
  widgetId: joi.string().required(),
  title: joi.string().required(),
  altText: joi.string().optional(),
  link: joi.string().required(),
  sequence: joi.number().optional(),
  img: joi.string().optional(),
  tileType: joi
    .string()
    .valid(...Object.values(TileTypes))
    .required(),
});

export const list = joi.object({
  search: joi.string().allow('').replace(/\s+/g, '_').default(''),
});

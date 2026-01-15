import joi from 'joi';
import { IPageSchema, IDefaultValidations } from '../../types';

type PageValidation = IPageSchema & IDefaultValidations;

export const create = joi.object<PageValidation>({
  name: joi.string().required(),
  code: joi
    .string()
    .uppercase()
    .replace(/\s+/g, '_')
    .required(),
  slug: joi
    .string()
    .required(),
  widgets: joi.array().items(joi.string()).optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const update = joi.object<PageValidation>({
  name: joi.string().optional(),
  widgets: joi.array().items(joi.string()).optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const list = joi.object({
  search: joi.string().allow('').replace(/\s+/g, '_').optional().default(''),
  options: joi
    .object({
      sort: joi
        .alternatives()
        .try(joi.object(), joi.string())
        .optional()
        .default({ _id: -1 }),
      populate: joi.array().items().optional().default([]),
      offset: joi.number().optional(),
      page: joi.number().optional(),
      limit: joi.number().optional(),
      pagination: joi.boolean().default(false),
    })
    .default({}),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

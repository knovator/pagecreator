import joi from 'joi';
import { Widget } from '../../models';
import { defaults } from '../defaults';
import { VALIDATION } from '../../constants';
import { getOne } from '../../services/dbService';
import {
  ItemsType,
  WidgetTypes,
  IWidgetSchema,
  CollectionItem,
  IDefaultValidations,
} from '../../types';

type TileValidation = IWidgetSchema & IDefaultValidations;

const checkUnique = async (value: string) => {
  let result;
  try {
    // throws error if document found
    result = await getOne(Widget, {
      code: value,
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}
  if (result) {
    throw new Error(VALIDATION.WIDGET_EXISTS);
  }
};

export const create = joi.object<TileValidation>({
  name: joi.string().required(),
  widgetTitle: joi.string().required(),
  code: joi
    .string()
    .uppercase()
    .replace(/\s+/g, '_')
    .external(checkUnique)
    .required(),
  isActive: joi.boolean().default(true).optional(),
  autoPlay: joi.boolean().default(false).optional(),
  webPerRow: joi.number().allow(null).optional(),
  mobilePerRow: joi.number().allow(null).optional(),
  tabletPerRow: joi.number().allow(null).optional(),
  collectionName: joi.string().optional(),
  collectionItems: joi.array().items(joi.string()).optional(),
  itemsType: joi
    .string()
    .custom((value) => {
      if (Object.keys(ItemsType).includes(value)) {
        return value;
      }
      const collectionIndex = defaults.collections.findIndex(
        (collection: CollectionItem) => collection.collectionName === value
      );
      if (collectionIndex > -1) {
        return value;
      }
      throw new Error(`${value} is not a valid widget type`);
    })
    .optional()
    .default(ItemsType.Image),
  widgetType: joi
    .string()
    .valid(...Object.values(WidgetTypes))
    .optional()
    .default(WidgetTypes.FixedCard),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const update = joi.object<TileValidation>({
  name: joi.string().required(),
  widgetTitle: joi.string().required(),
  isActive: joi.boolean().optional(),
  webPerRow: joi.number().allow(null).optional(),
  mobilePerRow: joi.number().allow(null).optional(),
  tabletPerRow: joi.number().allow(null).optional(),
  autoPlay: joi.boolean().default(false).optional(),
  collectionItems: joi.array().items(joi.string()).optional(),
  widgetType: joi
    .string()
    .valid(...Object.values(WidgetTypes))
    .optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const list = joi.object({
  search: joi.string().allow('').optional().default(''),
  options: joi
    .object({
      // sort: joi.alternatives().try(joi.object(), joi.string()).optional(),
      // populate: joi.array().items().optional(),
      offset: joi.number().optional(),
      page: joi.number().optional(),
      limit: joi.number().optional(),
    })
    .default({}),
  isActive: joi.boolean().optional(),
  all: joi.boolean().default(false),
});

export const partialUpdate = joi.object({
  isActive: joi.boolean().optional(),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

export const getCollectionData = joi.object({
  collectionName: joi.string().required(),
  search: joi.string().allow('').optional().default(''),
});

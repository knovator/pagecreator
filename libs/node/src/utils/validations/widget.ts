import joi from 'joi';
import { Widget } from '../../models';
import { defaults } from '../defaults';
import { VALIDATION } from '../../constants';
import { getOne } from '../../services/dbService';
import {
  ItemTypes,
  ItemsType,
  WidgetTypes,
  IWidgetSchema,
  CollectionItem,
  IDefaultValidations,
} from '../../types';

type ItemValidation = IWidgetSchema & IDefaultValidations;

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

const srcset = joi.object().keys({
  screenSize: joi.number().required(),
  width: joi.number().required(),
  height: joi.number().required(),
});

const item = joi.object({
  title: joi.string().required(),
  subtitle: joi.string().optional().allow(''),
  altText: joi.string().optional().allow(''),
  link: joi.string().optional().allow(''),
  sequence: joi.number().optional(),
  srcset: joi.array().items(srcset),
  img: joi.string().allow(null).optional(),
  itemType: joi
    .string()
    .valid(...Object.values(ItemTypes))
    .default(ItemTypes.Web),
});

export const create = joi.object<ItemValidation>({
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
  tabs: joi
    .array()
    .items(
      joi.object({
        name: joi.string(),
        collectionItems: joi.array().items(joi.string()).optional(),
      })
    )
    .optional(),
  items: joi.array().items(item).optional(),
  category: joi.string().optional(),
  backgroundColor: joi
    .string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .optional(),
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

export const update = joi.object<ItemValidation>({
  name: joi.string().required(),
  widgetTitle: joi.string().required(),
  category: joi.string().optional(),
  isActive: joi.boolean().optional(),
  webPerRow: joi.number().allow(null).optional(),
  mobilePerRow: joi.number().allow(null).optional(),
  tabletPerRow: joi.number().allow(null).optional(),
  autoPlay: joi.boolean().default(false).optional(),
  collectionItems: joi.array().items(joi.string()).optional(),
  tabs: joi
    .array()
    .items(
      joi.object({
        name: joi.string(),
        collectionItems: joi.array().items(joi.string()).optional(),
      })
    )
    .optional(),
  items: joi.array().items(item).optional(),
  backgroundColor: joi
    .string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .optional(),
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
      sort: joi
        .alternatives()
        .try(joi.object(), joi.string())
        .optional()
        .default({ _id: -1 }),
      // populate: joi.array().items().optional(),
      offset: joi.number().optional(),
      page: joi.number().optional(),
      limit: joi.number().optional(),
    })
    .default({
      sort: { _id: -1 },
    }),
  collectionItems: joi.array().optional().default([]),
  isActive: joi.boolean().optional(),
  all: joi.boolean().default(false),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
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
  collectionItems: joi.array().optional().default([]),
  createdBy: joi.any().optional(),
  updatedBy: joi.any().optional(),
  deletedBy: joi.any().optional(),
  deletedAt: joi.any().optional(),
});

import { Types, model, Schema, models } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Widget } from './../models';
import { create, remove, update, list, getAll } from '../services/dbService';
import {
  successResponse,
  createdDocumentResponse,
} from './../utils/responseHandlers';

import { defaults } from '../utils/defaults';
import {
  CollectionItem,
  IModel,
  IRequest,
  IResponse,
  SelectionTypes,
  TypesType,
  ItemsType,
} from '../types';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Notification');
};

export const createWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const data = req.body;
    const notification = await create(Widget, data);
    res.message = req?.i18n?.t('widget.create');
    return createdDocumentResponse(notification, res);
  }
);

export const updateWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const data = req.body;
    const _id = req.params['id'];
    const updatedNotification = await update(Widget, { _id }, data);
    res.message = req?.i18n?.t('widget.update');
    return successResponse(updatedNotification, res);
  }
);

export const deleteWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const _id = new Types.ObjectId(req.params['id']);
    const deletedNotification = await remove(Widget, { _id });
    res.message = req?.i18n?.t('widget.delete');
    return successResponse(deletedNotification, res);
  }
);

export const getWidgets = catchAsync(async (req: IRequest, res: IResponse) => {
  const search = req.body.search || '';
  const { page, limit } = req.body.options;
  const all =
    (typeof req.body.all !== 'undefined' && req.body.all === true) || false;
  const isActive =
    typeof req.body.isActive !== 'undefined'
      ? req.body.isActive || false
      : null;
  const customOptions = {
    pagination: !all,
    ...(page && limit ? { page, limit } : {}),
  };
  const query = {
    isDeleted: false,
    isActive: { $in: isActive === null ? [true, false] : [isActive] },
    $or: [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        code: {
          $regex: search,
          $options: 'i',
        },
      },
    ],
  };
  const notifications = await list(Widget, query, customOptions);
  res.message = req?.i18n?.t('widget.getAll');
  return successResponse(notifications, res);
});

export const partialUpdateWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const data = req.body;
    const _id = req.params['id'];
    const updatedNotification = await update(Widget, { _id }, data);
    res.message = req?.i18n?.t('widget.partialUpdate');
    return successResponse(updatedNotification, res);
  }
);

export const getItemsTypes = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const itemsTypes: TypesType[] = [
      {
        value: Object.keys(ItemsType)[0],
        label: Object.values(ItemsType)[0],
      },
    ];
    defaults.collections.forEach((item: CollectionItem) => {
      itemsTypes.push({
        value: item.collectionName,
        label: item.title,
      });
    });
    res.message = req?.i18n?.t('widget.getItemsTypes');
    return successResponse(itemsTypes, res);
  }
);

export const getSelectionTypes = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const selectionTypes = Object.entries(SelectionTypes).map((e) => ({
      label: e[1],
      value: e[0],
    }));
    res.message = req?.i18n?.t('widget.getSelectionTypes');
    return successResponse(selectionTypes, res);
  }
);

export const getCollectionData = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const limit = 10;
    const { search, collectionName } = req.body;
    const collectionItem: CollectionItem | undefined =
      defaults.collections.find(
        (collection) => collection.collectionName === collectionName
      );
    if (!collectionItem) {
      throw new Error(`No collection is specified with ${collectionName}`);
    }
    // setting up mongoose model
    let TempModel = models[collectionName] as unknown as IModel<any>;
    if (!TempModel) {
      const tempSchema = new Schema({}, { strict: false });
      TempModel = model(collectionName, tempSchema) as unknown as IModel<any>;
    }
    // fetching data
    let query: any = collectionItem.filters || {};
    if (search) {
      query = {
        ...query,
        $or: collectionItem.searchColumns
          ? collectionItem.searchColumns.map((column) => ({
              [column]: {
                $regex: search,
                $options: 'i',
              },
            }))
          : [],
      };
    }
    const collectionData = await getAll(TempModel, query, { limit });
    res.message = req?.i18n?.t('widget.getCollectionData');
    return successResponse({ docs: collectionData }, res);
  }
);

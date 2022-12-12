import { Types } from 'mongoose';
import { SrcSet, Item } from '../models';
import {
  create,
  remove,
  update,
  deleteAll,
  bulkInsert,
} from '../services/dbService';
import {
  successResponse,
  createdDocumentResponse,
} from '../utils/responseHandlers';

import { commonExcludedFields, defaults } from '../utils/defaults';
import { IRequest, IResponse, IItemSchema, SrcSetItem } from '../types';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Notification');
};

export const createItem = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const createdItem = (await create(Item, data)) as IItemSchema;
  let response = createdItem.toJSON();
  if (data.srcset) {
    response = {
      ...response,
      srcset: (await updateItemSrcSet(
        createdItem._id,
        data.srcset
      )) as SrcSetItem[],
    };
  }
  res.message = req?.i18n?.t('item.create');
  return createdDocumentResponse(response, res);
});

export const updateItem = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const _id = req.params['id'];
  const updatedItem = (await update(Item, { _id }, data)) as IItemSchema;
  let response = updatedItem.toJSON();
  if (data.srcset) {
    response = {
      ...response,
      srcset: (await updateItemSrcSet(_id, data.srcset)) as SrcSetItem[],
    };
  }
  res.message = req?.i18n?.t('item.update');
  return successResponse(response, res);
});

export const deleteItem = catchAsync(async (req: IRequest, res: IResponse) => {
  const _id = new Types.ObjectId(req.params['id']);
  const deletedItem = await remove(Item, { _id });
  res.message = req?.i18n?.t('item.delete');
  return successResponse(deletedItem, res);
});

export const getItems = catchAsync(async (req: IRequest, res: IResponse) => {
  const widgetId = req.params['widgetId'];
  const items = await Item.aggregate([
    {
      $match: {
        widgetId: new Types.ObjectId(widgetId),
        isDeleted: false,
      },
    },
    {
      $project: {
        ...commonExcludedFields,
      },
    },
    {
      $lookup: {
        from: 'file',
        let: { imgId: '$img' },
        as: 'img',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$imgId'],
              },
            },
          },
          {
            $project: {
              ...commonExcludedFields,
              width: 0,
              module: 0,
              height: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'srcsets',
        let: { item: '$_id' },
        as: 'srcset',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$itemId', '$$item'],
              },
            },
          },
          {
            $project: {
              ...commonExcludedFields,
              _id: 0,
              itemId: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: '$img',
    },
  ]);
  res.message = req?.i18n?.t('item.getAll');
  return successResponse(items, res);
});

const updateItemSrcSet = async (itemId: string, srcSets: SrcSetItem[]) => {
  await deleteAll(SrcSet, { itemId });
  const modifiedSrcSets = srcSets.map((set) => ({
    ...set,
    itemId,
  }));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await bulkInsert(SrcSet, modifiedSrcSets);
};

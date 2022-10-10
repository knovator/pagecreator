import { Types } from 'mongoose';
import { SrcSet, Tile } from './../models';
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
} from './../utils/responseHandlers';

import { commonExcludedFields, defaults } from '../utils/defaults';
import { IRequest, IResponse, ITileSchema, SrcSetItem } from '../types';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Notification');
};

export const createTile = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const createdTile = (await create(Tile, data)) as ITileSchema;
  let response = createdTile.toJSON();
  if (data.srcset) {
    response = {
      ...response,
      srcset: (await updateTileSrcSet(
        createdTile._id,
        data.srcset
      )) as SrcSetItem[],
    };
  }
  res.message = req?.i18n?.t('tile.create');
  return createdDocumentResponse(response, res);
});

export const updateTile = catchAsync(async (req: IRequest, res: IResponse) => {
  const data = req.body;
  const _id = req.params['id'];
  const updatedTile = (await update(Tile, { _id }, data)) as ITileSchema;
  let response = updatedTile.toJSON();
  if (data.srcset) {
    response = {
      ...response,
      srcset: (await updateTileSrcSet(_id, data.srcset)) as SrcSetItem[],
    };
  }
  res.message = req?.i18n?.t('tile.update');
  return successResponse(response, res);
});

export const deleteTile = catchAsync(async (req: IRequest, res: IResponse) => {
  const _id = new Types.ObjectId(req.params['id']);
  const deletedTile = await remove(Tile, { _id });
  res.message = req?.i18n?.t('tile.delete');
  return successResponse(deletedTile, res);
});

export const getTiles = catchAsync(async (req: IRequest, res: IResponse) => {
  const widgetId = req.params['widgetId'];
  const tiles = await Tile.aggregate([
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
        let: { tile: '$_id' },
        as: 'srcset',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$tileId', '$$tile'],
              },
            },
          },
          {
            $project: {
              ...commonExcludedFields,
              _id: 0,
              tileId: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: '$img',
    },
  ]);
  res.message = req?.i18n?.t('tile.getAll');
  return successResponse(tiles, res);
});

const updateTileSrcSet = async (tileId: string, srcSets: SrcSetItem[]) => {
  await deleteAll(SrcSet, { tileId });
  const modifiedSrcSets = srcSets.map((set) => ({
    ...set,
    tileId,
  }));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await bulkInsert(SrcSet, modifiedSrcSets);
};
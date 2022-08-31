import { Widget, Tile } from './../models';
import { getOne, getAll } from '../services/dbService';
import { successResponse } from './../utils/responseHandlers';
import { IRequest, IResponse, ObjectType } from '../types';

import { defaults } from '../utils/defaults';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'User');
};

export const getWidgetData = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const { code } = req.body;
    const widgetData = await getOne(
      Widget,
      { code, isActive: true },
      { __v: 0 }
    );
    const data: ObjectType = { ...widgetData.toJSON() };
    if (widgetData.widgetType === 'Image') {
      const tiles = await getAll(
        Tile,
        { widgetId: widgetData._id },
        { sort: 'sequence' },
        { widgetId: 0, __v: 0, sequence: 0 }
      ).populate({
        path: 'img',
        select: 'uri',
      });
      data['webTiles'] = tiles.filter((tile) => tile.tileType === 'Web');
      data['mobileTiles'] = tiles.filter((tile) => tile.tileType === 'Mobile');
    } else {
      await widgetData.populate('collectionItems');
    }
    res.message = req?.i18n?.t('user.widgetData');
    return successResponse(data, res);
  }
);

// export const getPageData = catchAsync(
//   async (req: IRequest, res: IResponse) => {}
// );

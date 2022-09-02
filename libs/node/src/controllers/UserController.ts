import { Widget, Page } from './../models';
import { successResponse } from './../utils/responseHandlers';
import { IPageSchema, IRequest, IResponse, IWidgetSchema } from '../types';

import { defaults } from '../utils/defaults';

const commonExcludedFields = {
  __v: 0,
  isDeleted: 0,
  deletedAt: 0,
};

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'User');
};

export const getWidgetData = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const { code } = req.body;
    const newWidgetData = (await Widget.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
          code,
        },
      },
      {
        // Get only the fields that are not excluded
        $project: {
          ...commonExcludedFields,
        },
      },
      {
        // Get Tiles data
        $lookup: {
          from: 'tiles',
          let: { widget: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$widgetId', '$$widget'],
                },
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
                let: { img: '$img' },
                as: 'image',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$img'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      uri: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$image',
            },
          ],
          as: 'tiles',
        },
      },
    ])) as Array<IWidgetSchema>;

    if (!newWidgetData.length) throw new Error(`Widget not found`);
    await Widget.populate(newWidgetData[0], { path: 'collectionItems' });
    return successResponse(newWidgetData[0], res);
  }
);

export const getPageData = catchAsync(async (req: IRequest, res: IResponse) => {
  const { code } = req.body;
  const pageData = (await Page.aggregate([
    {
      $match: {
        isDeleted: false,
        code: code,
      },
    },
    {
      $project: {
        isDeleted: 0,
        deletedAt: 0,
        __v: 0,
      },
    },
    {
      $lookup: {
        from: 'widgets',
        let: { widgets: '$widgets' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$widgets'],
              },
              isDeleted: false,
            },
          },
          {
            $project: {
              widgetId: 0,
              sequence: 0,
              ...commonExcludedFields,
            },
          },
          {
            $lookup: {
              from: 'tiles',
              let: { widget: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$widgetId', '$$widget'],
                    },
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
                    let: { img: '$img' },
                    as: 'image',
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$_id', '$$img'],
                          },
                        },
                      },
                      {
                        $project: {
                          _id: 1,
                          uri: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: '$image',
                },
              ],
              as: 'tiles',
            },
          },
        ],
        as: 'widgets',
      },
    },
  ])) as Array<IPageSchema>;

  if (!pageData.length) throw new Error('Page not found');
  await Widget.populate(pageData[0].widgets, {
    path: 'collectionItems',
    options: { projection: commonExcludedFields },
  });
  res.message = req?.i18n?.t('user.pageData');
  return successResponse(pageData[0], res);
});

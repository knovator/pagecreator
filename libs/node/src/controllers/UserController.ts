import { AggregateOptions } from 'mongoose';
import { Widget, Page } from './../models';
import {
  AddSrcSetsToItems,
  appendCollectionData,
  getCollectionModal,
} from '../utils/helper';
import { successResponse } from './../utils/responseHandlers';
import { defaults, commonExcludedFields } from '../utils/defaults';
import { IPageSchema, IRequest, IResponse, IWidgetSchema } from '../types';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'User');
};

// TO Do: Optimize the following
export const getWidgetData = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const { code } = req.body;
    const widgetDataArr = (await Widget.aggregate([
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
        // Get Items data
        $lookup: {
          from: 'items',
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
              $unwind: '$image',
            },
          ],
          as: 'items',
        },
      },
    ])) as Array<IWidgetSchema>;

    if (!widgetDataArr.length) throw new Error(`Widget not found`);
    const widgetData = widgetDataArr[0];

    if (
      widgetData.collectionName &&
      widgetData.collectionItems &&
      widgetData.collectionItems.length > 0
    ) {
      const collectionConfig = defaults.collections.find(
        (c) => c.collectionName === widgetData.collectionName
      );
      const aggregateQuery: AggregateOptions = {
        $match: {
          _id: {
            $in: widgetData.collectionItems,
          },
          ...(collectionConfig?.match || {}),
        },
      };
      if (collectionConfig?.project)
        aggregateQuery['$project'] = collectionConfig?.project;
      if (collectionConfig?.lookup)
        aggregateQuery['$lookup'] = collectionConfig?.lookup;

      const aggregateQueryItem: AggregateOptions[] = [];
      if (aggregateQuery['$match'])
        aggregateQueryItem.push({ $match: aggregateQuery['$match'] });
      if (aggregateQuery['$lookup'])
        aggregateQueryItem.push({ $lookup: aggregateQuery['$lookup'] });
      if (aggregateQuery['$project'])
        aggregateQueryItem.push({ $project: aggregateQuery['$project'] });

      const collectionModal: any = getCollectionModal(
        widgetData.collectionName
      );
      const collectionItems = await collectionModal.aggregate(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        aggregateQueryItem
      );
      widgetData.collectionItems = collectionItems;
    }
    if (
      widgetData.collectionName &&
      widgetData.tabs &&
      widgetData.tabs.length > 0
    ) {
      const collectionConfig = defaults.collections.find(
        (c) => c.collectionName === widgetData.collectionName
      );
      const tabCollectionItemIds = widgetData.tabs.reduce(
        (acc: string[], tabItem: any) => {
          acc.push(...tabItem.collectionItems);
          return acc;
        },
        []
      );
      const aggregateQuery: AggregateOptions = {
        $match: {
          _id: {
            $in: tabCollectionItemIds,
          },
          ...(collectionConfig?.match || {}),
        },
      };
      if (collectionConfig?.project)
        aggregateQuery['$project'] = collectionConfig?.project;
      if (collectionConfig?.lookup)
        aggregateQuery['$lookup'] = collectionConfig?.lookup;

      const aggregateQueryItem: AggregateOptions[] = [];
      if (aggregateQuery['$match'])
        aggregateQueryItem.push({ $match: aggregateQuery['$match'] });
      if (aggregateQuery['$lookup'])
        aggregateQueryItem.push({ $lookup: aggregateQuery['$lookup'] });
      if (aggregateQuery['$project'])
        aggregateQueryItem.push({ $project: aggregateQuery['$project'] });

      const collectionModal: any = getCollectionModal(
        widgetData.collectionName
      );
      const collectionItems: any = await collectionModal.aggregate(
        aggregateQueryItem
      );
      // converting colleciton items to obj to better access them
      const collectionItemsObj = collectionItems.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item;
          return acc;
        },
        {}
      );
      widgetData.tabs = widgetData.tabs.map((tabItem) => {
        return {
          name: tabItem.name,
          collectionItems: tabItem.collectionItems.map(
            (collectionId) => collectionItemsObj[collectionId]
          ),
        };
      });
    }
    AddSrcSetsToItems(widgetData);
    return successResponse(widgetData, res);
  }
);

// TO Do: Optimize the following
export const getPageData = catchAsync(async (req: IRequest, res: IResponse) => {
  const { code } = req.body;
  const pageData: any = (await Page.aggregate([
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
              from: 'items',
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
                  $unwind: '$image',
                },
              ],
              as: 'items',
            },
          },
        ],
        as: 'widgetsData',
      },
    },
  ])) as Array<IPageSchema>;

  if (!pageData.length) throw new Error('Page not found');
  pageData[0].widgetsData = await appendCollectionData(pageData[0].widgetsData);
  if (
    Array.isArray(pageData[0].widgetsData) &&
    pageData[0].widgetsData.length > 0
  ) {
    pageData[0].widgetsData.forEach((widget: IWidgetSchema) => {
      AddSrcSetsToItems(widget);
    });
  }
  pageData[0].widgetsData = pageData[0].widgetsData.reduce(
    (acc: any, widgetItem: any) => {
      acc[widgetItem._id] = widgetItem;
      return acc;
    },
    []
  );
  pageData[0].widgets = pageData[0].widgets.map(
    (widgetId: string) => pageData[0].widgetsData[widgetId]
  );
  delete pageData[0].widgetsData;
  res.message = req?.i18n?.t('user.pageData');
  return successResponse(pageData[0], res);
});

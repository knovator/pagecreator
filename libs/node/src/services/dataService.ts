import { AggregateOptions, Models, Types } from 'mongoose';
import {
  AddSrcSetsToItems,
  appendCollectionData,
  getCollectionModal,
  formatCollectionItems,
  buildAggregations,
} from '../utils/helper';
import { setRedisValue, deleteRedisValue } from '../utils/redis';
import { defaults, commonExcludedFields } from '../utils/defaults';
import { IPageSchema, IWidgetSchema, IRequest } from '../types';

// Helper to filter out undefined/null values from query fields
const filterDefinedFields = (obj: Record<string, unknown> = {}): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null)
  );
};

const getAggregationQuery = ({
  collectionName,
  ids,
  req,
}: {
  collectionName: string;
  ids: object[];
  req?: IRequest;
}) => {
  // Handle built-in "pages" collection
  if (collectionName === 'pages') {
    return [
      {
        $match: {
          _id: { $in: ids },
          isDeleted: false,
          $or: [
            { isActive: true },
            { isActive: { $exists: false } }  // Include pages without isActive field
          ],
        },
      },
      { $project: { _id: 1, name: 1, slug: 1, code: 1, filterQuery: 1 } },
      { $addFields: { __order: { $indexOfArray: [ids, '$_id'] } } },
      { $sort: { __order: 1 } },
    ];
  }

  const collectionConfig = defaults.collections.find(
    (c) => c.collectionName === collectionName
  );
  const aggregateQueryItem: AggregateOptions[] = [];
  const aggregations = buildAggregations(collectionConfig?.aggregations, req);
  if (aggregations.length) {
    aggregateQueryItem.push(...aggregations);
  }
  aggregateQueryItem.push(
    {
      $match: {
        _id: {
          $in: ids,
        },
        ...(collectionConfig?.match || {}),
        ...filterDefinedFields(req?.defaultQueryFields),
      },
    },
    { $addFields: { __order: { $indexOfArray: [ids, '$_id'] } } },
    { $sort: { __order: 1 } }
  );
  return aggregateQueryItem;
};

const getLatestBlogsQuery = ({
  collectionName,
  category,
  limit,
  req,
}: {
  collectionName: string;
  category?: any;
  limit?: number;
  req?: IRequest;
}) => {
  const collectionConfig = defaults.collections.find(
    (c) => c.collectionName === collectionName
  );
  const aggregateQueryItem: AggregateOptions[] = [];

  // Add custom aggregations from config
  const aggregations = buildAggregations(collectionConfig?.aggregations, req);
  if (aggregations.length) {
    aggregateQueryItem.push(...aggregations);
  }

  // Build match conditions
  const matchConditions: any = {
    ...(collectionConfig?.match || {}),
    ...(req?.defaultQueryFields || {}),
  };

  // Add category filter if provided
  if (category) {
    try {
      const categoryObjectId = new Types.ObjectId(category);
      const categoryString = category.toString();

      // Handle multiple category field structures:
      // - Array of ObjectIds (unpopulated)
      // - Populated objects with _id field
      // - Populated objects with id field (ObjectId or string)
      matchConditions.$or = [
        { category: { $in: [categoryObjectId] } },
        { 'category._id': categoryObjectId },
        { 'category.id': categoryObjectId },
        { 'category.id': categoryString },
      ];
    } catch (error) {
      // Fallback to simple match if ObjectId conversion fails
      matchConditions.category = category;
    }
  }

  aggregateQueryItem.push({
    $match: matchConditions,
  });

  // Sort by createdAt descending (latest first)
  aggregateQueryItem.push({
    $sort: { createdAt: -1 },
  });

  // Apply limit if provided
  if (limit && limit > 0) {
    aggregateQueryItem.push({
      $limit: limit,
    });
  }

  return aggregateQueryItem;
};

export const getWidgetDataDB = async (
  code: string,
  models: Models,
  req?: IRequest
) => {
  const { Widget } = models;
  const widgetDataArr = (await Widget.aggregate([
    {
      $match: {
        ...filterDefinedFields(req?.defaultQueryFields),
        isDeleted: false,
        isActive: true,
        code,
      },
    },
    {
      // Get only the fields that are not excluded
      $project: {
        __v: 0,
        isDeleted: 0,
        deletedAt: 0,
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
          ...(defaults.languages && defaults.languages?.length > 0
            ? defaults.languages.reduce((arr: any[], lng) => {
              arr.push(
                {
                  $lookup: {
                    from: 'file',
                    let: { img: { $toObjectId: `$imgs.${lng.code}` } },
                    as: `images.${lng.code}`,
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
                  $unwind: {
                    path: `$images.${lng.code}`,
                    preserveNullAndEmptyArrays: true,
                  },
                }
              );
              return arr;
            }, [])
            : [
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
                $unwind: {
                  path: '$image',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ]),
          {
            $project: {
              sequence: 0,
              imgs: 0,
              ...commonExcludedFields,
            },
          },
          // {
          //   $lookup: {
          //     from: 'srcsets',
          //     let: { item: '$_id' },
          //     as: 'srcset',
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $eq: ['$itemId', '$$item'],
          //           },
          //         },
          //       },
          //       {
          //         $project: {
          //           ...commonExcludedFields,
          //           _id: 0,
          //           itemId: 0,
          //         },
          //       },
          //     ],
          //   },
          // },
        ],
        as: 'items',
      },
    },
  ])) as Array<IWidgetSchema>;

  if (!widgetDataArr.length) {
    return null;
  }
  const widgetData = widgetDataArr[0];

  // Fetch latest blogs by category/limit if configured
  if (
    widgetData.collectionName === 'blog' &&
    (widgetData.blogLimit || widgetData.blogCategory)
  ) {
    const aggregateQueryItem = getLatestBlogsQuery({
      collectionName: widgetData.collectionName,
      category: widgetData.blogCategory,
      limit: widgetData.blogLimit,
      req,
    });

    const collectionModal: any = getCollectionModal(widgetData.collectionName, models);
    const collectionItems = await collectionModal.aggregate(aggregateQueryItem);
    widgetData.collectionItems = collectionItems;
  }
  // Otherwise, fetch specific collection items if they exist
  else if (
    widgetData.collectionName &&
    widgetData.collectionItems &&
    widgetData.collectionItems.length > 0
  ) {
    const aggregateQueryItem = getAggregationQuery({
      collectionName: widgetData.collectionName,
      ids: formatCollectionItems(widgetData.collectionItems),
      req,
    });
    const collectionModal: any = getCollectionModal(widgetData.collectionName, models);
    const collectionItems = await collectionModal.aggregate(aggregateQueryItem);
    widgetData.collectionItems = collectionItems;
  }
  if (
    widgetData.collectionName &&
    widgetData.tabs &&
    widgetData.tabs.length > 0
  ) {
    const tabCollectionItemIds = widgetData.tabs.reduce(
      (acc: string[], tabItem: any) => {
        acc.push(...tabItem.collectionItems);
        return acc;
      },
      []
    );
    const aggregateQueryItem = getAggregationQuery({
      collectionName: widgetData.collectionName,
      ids: formatCollectionItems(tabCollectionItemIds),
      req,
    });

    const collectionModal: any = getCollectionModal(widgetData.collectionName, models);
    const collectionItems: any = await collectionModal.aggregate(
      aggregateQueryItem
    );
    // converting colleciton items to obj to better access them
    const collectionItemsObj = collectionItems.reduce((acc: any, item: any) => {
      acc[item._id] = item;
      return acc;
    }, {});
    widgetData.tabs = widgetData.tabs.map((tabItem) => {
      return {
        name: tabItem.name,
        names: tabItem.names,
        collectionItems: tabItem.collectionItems.map(
          (collectionId) => collectionItemsObj[collectionId]
        ),
      };
    });
  }
  AddSrcSetsToItems(widgetData);
  return widgetData;
};

export const updateRedisWidget = async (code: string, models: Models, req?: IRequest) => {
  const widgetData = await getWidgetDataDB(code, models, req);
  if (widgetData) {
    const clientId = req?.defaultQueryFields?.clientId;
    const cacheKey = clientId ? `widgetData_${clientId}_${code}` : `widgetData_${code}`;
    await setRedisValue(cacheKey, widgetData as unknown as JSON);
  }
};

export const updateWidgetPagesData = async (
  widgetIds: string[],
  models: Models,
  clientId?: string
) => {
  const { Page } = models;
  const pageCodes = await Page.find(
    {
      widgets: {
        $in: widgetIds,
      },
    },
    'code'
  ).distinct('code');
  if (pageCodes.length) {
    pageCodes.forEach((code) => {
      const cacheKey = clientId ? `pageData_${clientId}_${code}` : `pageData_${code}`;
      deleteRedisValue(cacheKey);
    });
  }
};

export const getPageDataDB = async (
  code: string,
  models: Models,
  req?: IRequest
) => {
  const { Page } = models;
  const pageData: any = (await Page.aggregate([
    {
      $match: {
        ...filterDefinedFields(req?.defaultQueryFields),
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
        let: { widgets: '$widgets', pageClientId: '$clientId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$_id', '$$widgets'] },
                  { $eq: ['$clientId', '$$pageClientId'] },
                ],
              },
              isDeleted: false,
              isActive: true,
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
                ...(defaults.languages && defaults.languages?.length > 0
                  ? defaults.languages.reduce((arr: any[], lng) => {
                    arr.push(
                      {
                        $lookup: {
                          from: 'file',
                          let: { img: { $toObjectId: `$imgs.${lng.code}` } },
                          as: `images.${lng.code}`,
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
                        $unwind: {
                          path: `$images.${lng.code}`,
                          preserveNullAndEmptyArrays: true,
                        },
                      }
                    );
                    return arr;
                  }, [])
                  : [
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
                      $unwind: {
                        path: '$image',
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                  ]),
                {
                  $project: {
                    sequence: 0,
                    imgs: 0,
                    ...commonExcludedFields,
                  },
                },
                // {
                //   $lookup: {
                //     from: 'srcsets',
                //     let: { item: '$_id' },
                //     as: 'srcset',
                //     pipeline: [
                //       {
                //         $match: {
                //           $expr: {
                //             $eq: ['$itemId', '$$item'],
                //           },
                //         },
                //       },
                //       {
                //         $project: {
                //           ...commonExcludedFields,
                //           _id: 0,
                //           itemId: 0,
                //         },
                //       },
                //     ],
                //   },
                // },
              ],
              as: 'items',
            },
          },
        ],
        as: 'widgetsData',
      },
    },
  ])) as Array<IPageSchema>;

  if (!pageData.length) {
    return null;
  }
  pageData[0].widgetsData = await appendCollectionData(
    pageData[0].widgetsData,
    models,
    req
  );
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
  pageData[0].widgets = pageData[0].widgets
    .map((widgetId: string) => pageData[0].widgetsData[widgetId])
    .filter(Boolean);
  delete pageData[0].widgetsData;
  return pageData[0];
};

export const updateRedisPage = async (code: string, models: Models, req?: IRequest) => {
  const pageData = await getPageDataDB(code, models, req);
  if (pageData) {
    const clientId = req?.defaultQueryFields?.clientId;
    const cacheKey = clientId ? `pageData_${clientId}_${code}` : `pageData_${code}`;
    await setRedisValue(cacheKey, pageData);
  }
};

export const handleUpdateData = async (
  collectionName: string,
  itemId: string | string[],
  models: Models,
  clientId?: string
) => {
  if (!models) throw new Error('models is required');
  const { Widget } = models;
  const widgets = await Widget.find(
    {
      collectionName: collectionName,
      collectionItems: {
        $in: Array.isArray(itemId) ? itemId : [itemId],
      },
    },
    'code _id'
  ).lean();
  if (widgets.length) {
    updateWidgetPagesData(
      widgets.map((widget: any) => widget._id),
      models,
      clientId
    );
    widgets.forEach((widget) => {
      const cacheKey = clientId ? `widgetData_${clientId}_${widget['code']}` : `widgetData_${widget['code']}`;
      deleteRedisValue(cacheKey);
    });
  }
};

export const handleResetData = (type: 'widget' | 'page', code: string) => {
  if ((type === 'widget' || type === 'page') && code)
    deleteRedisValue(`${type}_${code}`);
};

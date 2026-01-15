import { AggregateOptions, Models } from 'mongoose';
import {
  AddSrcSetsToItems,
  appendCollectionData,
  getCollectionModal,
} from '../utils/helper';
import { setRedisValue, deleteRedisValue } from '../utils/redis';
import { defaults, commonExcludedFields } from '../utils/defaults';
import { IPageSchema, IWidgetSchema } from '../types';

const getAggregationQuery = ({
  collectionName,
  ids,
}: {
  collectionName: string;
  ids: string[];
}) => {
  const collectionConfig = defaults.collections.find(
    (c) => c.collectionName === collectionName
  );
  const aggregateQueryItem: AggregateOptions[] = [];
  if (
    Array.isArray(collectionConfig?.aggregations) &&
    collectionConfig?.aggregations.length
  ) {
    aggregateQueryItem.push(...collectionConfig.aggregations);
  }
  aggregateQueryItem.push(
    {
      $match: {
        _id: {
          $in: ids,
        },
        ...(collectionConfig?.match || {}),
      },
    },
    { $addFields: { __order: { $indexOfArray: [ids, '$_id'] } } },
    { $sort: { __order: 1 } }
  );
  return aggregateQueryItem;
};

export const getWidgetDataDB = async (code: string, models: Models) => {
  const { Widget } = models;
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

  if (
    widgetData.collectionName &&
    widgetData.collectionItems &&
    widgetData.collectionItems.length > 0
  ) {
    const aggregateQueryItem = getAggregationQuery({
      collectionName: widgetData.collectionName,
      ids: widgetData.collectionItems,
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
      ids: tabCollectionItemIds,
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

export const updateRedisWidget = async (code: string, models: Models) => {
  const widgetData = await getWidgetDataDB(code, models);
  if (widgetData) {
    await setRedisValue(`widgetData_${code}`, widgetData as unknown as JSON);
  }
};

export const updateWidgetPagesData = async (
  widgetIds: string[],
  models: Models
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
      deleteRedisValue(`pageData_${code}`);
    });
  }
};

export const getPageDataDB = async (code: string, models: Models) => {
  const { Page } = models;
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
  pageData[0].widgetsData = await appendCollectionData(pageData[0].widgetsData, models);
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

export const updateRedisPage = async (code: string, models: Models) => {
  const pageData = await getPageDataDB(code, models);
  if (pageData) {
    await setRedisValue(`pageData_${code}`, pageData);
  }
};

export const handleUpdateData = async (
  collectionName: string,
  itemId: string | string[],
  models: Models
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
      models
    );
    widgets.forEach((widget) => {
      deleteRedisValue(`widgetData_${widget['code']}`);
    });
  }
};

export const handleResetData = (type: 'widget' | 'page', code: string) => {
  if ((type === 'widget' || type === 'page') && code)
    deleteRedisValue(`${type}_${code}`);
};

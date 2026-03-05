import { model, Models, Schema, Types } from 'mongoose';
import { commonExcludedFields, defaults } from './defaults';
import {
  IRequest,
  IWidgetData,
  IWidgetDataSchema,
  IWidgetSchema,
  SrcSetItem,
} from '../types';

export function buildAggregations(aggregations: any[] | undefined, req?: IRequest) {
  if (!Array.isArray(aggregations) || !aggregations.length) {
    return [];
  }

  const clientId = req?.defaultQueryFields?.clientId;
  if (!clientId) {
    return aggregations;
  }

  return aggregations.map((agg) => {
    if (agg.$match) {
      return {
        ...agg,
        $match: {
          ...agg.$match,
          clientId,
        },
      };
    }
    return agg;
  });
}


export async function appendCollectionData(widgetData: IWidgetSchema[], models: Models, req?: IRequest) {
  const { Widget } = models;
  // reduce widget data to optimize query
  const newData: IWidgetData = widgetData.reduce(
    (acc: IWidgetData, widget: IWidgetSchema) => {
      if (widget.collectionName) {
        acc[widget.code] = {
          _id: widget._id,
          code: widget.code,
          collectionName: widget.collectionName,
          collectionItems: widget.collectionItems,
          tabs: widget.tabs,
        };
      }
      return acc;
    },
    {}
  );
  if (Object.keys(newData).length > 0) {
    // Fetch latest blogs for widgets with category/limit configuration
    const blogWidgetsData: any = {};
    for (const widget of widgetData) {
      if (widget.collectionName === 'blog' && (widget.blogCategory || widget.blogLimit)) {
        try {
          const collectionConfig = defaults.collections.find(
            (c) => c.collectionName === widget.collectionName
          );
          const aggregateQueryItem: any[] = [];

          // Add custom aggregations from config
          const aggregations = buildAggregations(collectionConfig?.aggregations, req);
          if (aggregations.length) {
            aggregateQueryItem.push(...aggregations);
          }

          // Build match conditions
          const matchConditions: any = {
            ...(collectionConfig?.match || {}),
          };

          // Add category filter if provided
          if (widget.blogCategory) {
            const categoryObjectId = new Types.ObjectId(widget.blogCategory);
            const categoryString = widget.blogCategory.toString();

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
          }

          // Add match, sort, and limit stages
          aggregateQueryItem.push({
            $match: matchConditions,
          });

          aggregateQueryItem.push({
            $sort: { createdAt: -1 },
          });

          if (widget.blogLimit && widget.blogLimit > 0) {
            aggregateQueryItem.push({
              $limit: widget.blogLimit,
            });
          }

          // Fetch data from collection
          const collectionModal: any = getCollectionModal(widget.collectionName, models);
          const collectionItems = await collectionModal.aggregate(aggregateQueryItem);

          blogWidgetsData[widget.code] = collectionItems;
        } catch (error) {
          blogWidgetsData[widget.code] = [];
        }
      }
    }

    // Apply blog widgets data
    if (Object.keys(blogWidgetsData).length > 0) {
      widgetData = widgetData.map((widget: IWidgetSchema) => {
        if (blogWidgetsData[widget.code]) {
          return {
            ...widget,
            collectionItems: blogWidgetsData[widget.code],
          };
        }
        return widget;
      }) as any;
    }

    const aggregationQueryCollectionItems = buildCollectionItemsQuery(newData, req);
    if (aggregationQueryCollectionItems.length > 0) {
      // getting collection data by populating widget
      let aggregationData: any = await Widget.aggregate(
        aggregationQueryCollectionItems
      );
      aggregationData = aggregationData.reduce((acc: any, aggregation: any) => {
        acc[aggregation.code] = aggregation[aggregation.code];
        return acc;
      }, {});
      // adding collection data to widgets
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      widgetData = widgetData.map((widget: IWidgetSchema) => {
        // Skip widgets already processed by blog section
        if (blogWidgetsData[widget.code]) {
          return widget;
        }
        if (aggregationData[widget.code]) {
          return {
            ...widget,
            collectionItems: aggregationData[widget.code],
          };
        }
        return widget;
      });
    }
    const aggregationQueryTabs = buildTabCollectionItemsQuery(newData, req);
    if (aggregationQueryTabs.length > 0) {
      let aggregationDataTabs: any = await Widget.aggregate(
        aggregationQueryTabs
      );
      aggregationDataTabs = aggregationDataTabs.reduce(
        (acc: any, aggregation: any) => {
          if (aggregation[aggregation.code])
            acc[aggregation.code] = aggregation[aggregation.code];
          return acc;
        },
        {}
      );
      // adding collection data to widgets
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      widgetData = widgetData.map((widget) => {
        if (!aggregationDataTabs[widget.code]) return widget;
        const collectionItemsObj = aggregationDataTabs[widget.code].reduce(
          (acc: any, item: any) => {
            acc[item._id] = item;
            return acc;
          },
          {}
        );
        return {
          ...widget,
          tabs: widget.tabs.map((tabItem) => {
            return {
              name: tabItem.name,
              names: tabItem.names,
              collectionItems: tabItem.collectionItems
                .map((collectionId) => collectionItemsObj[collectionId])
                .filter(Boolean),
            };
          }),
        };
      });
    }
  }
  // returning widget data as it is if they do not have dynamic collection
  return widgetData;
}

function buildCollectionItemsQuery(
  formattedWidgetData: IWidgetData,
  req?: IRequest
) {
  const aggregationQuery: any = [
    {
      $match: {
        _id: {
          $in: Object.values(formattedWidgetData).map(
            (item: IWidgetDataSchema) => item._id
          ),
        },
      },
    },
    {
      // Get only the fields that are not excluded
      $project: {
        _id: 1,
        code: 1,
      },
    },
  ];
  let collectionConfig;
  Object.keys(formattedWidgetData).forEach((key: string) => {
    if (
      formattedWidgetData[key].collectionItems &&
      formattedWidgetData[key].collectionItems.length > 0
    ) {
      const ids = formatCollectionItems(
        formattedWidgetData[key].collectionItems
      );

      // Handle built-in "pages" collection
      if (formattedWidgetData[key].collectionName === 'pages') {
        aggregationQuery.push({
          $lookup: {
            from: 'pages',
            pipeline: [
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
            ],
            as: formattedWidgetData[key].code,
          },
        });
        return;
      }

      const aggregationQueryPiplelines: any[] = [];
      collectionConfig = defaults.collections.find(
        (c) => c.collectionName === formattedWidgetData[key].collectionName
      );
      const aggregations = buildAggregations(collectionConfig?.aggregations, req);
      if (aggregations.length) {
        aggregationQueryPiplelines.push(...aggregations);
      }
      // Build piplelines with config
      aggregationQueryPiplelines.push(
        ...[
          {
            $match: {
              _id: {
                $in: ids,
              },
              ...(collectionConfig?.match || {}),
              ...(req?.defaultQueryFields || {}),
            },
          },
          {
            $project: {
              ...commonExcludedFields,
            },
          },
          { $addFields: { __order: { $indexOfArray: [ids, '$_id'] } } },
          { $sort: { __order: 1 } },
        ]
      );
      // Build Aggregation Query
      aggregationQuery.push({
        $lookup: {
          from: formattedWidgetData[key].collectionName,
          pipeline: aggregationQueryPiplelines,
          as: formattedWidgetData[key].code,
        },
      });
    }
  });
  return aggregationQuery;
}

function buildTabCollectionItemsQuery(
  formattedWidgetData: IWidgetData,
  req?: IRequest
) {
  const aggregationQuery: any = [
    {
      $match: {
        _id: {
          $in: Object.values(formattedWidgetData).map(
            (item: IWidgetDataSchema) => item._id
          ),
        },
      },
    },
    {
      // Get only the fields that are not excluded
      $project: {
        _id: 1,
        code: 1,
      },
    },
  ];
  let collectionConfig;
  Object.keys(formattedWidgetData).forEach((key: string) => {
    if (
      formattedWidgetData[key].tabs &&
      formattedWidgetData[key].tabs.length > 0
    ) {
      const tabIds = formattedWidgetData[key].tabs.reduce(
        (arr: Types.ObjectId[], tabItem) => {
          arr.push(...formatCollectionItems(tabItem.collectionItems));
          return arr;
        },
        []
      );

      // Handle built-in "pages" collection
      if (formattedWidgetData[key].collectionName === 'pages') {
        aggregationQuery.push({
          $lookup: {
            from: 'pages',
            pipeline: [
              {
                $match: {
                  _id: { $in: tabIds },
                  isDeleted: false,
                  $or: [
                    { isActive: true },
                    { isActive: { $exists: false } }  // Include pages without isActive field
                  ],
                },
              },
              { $project: { _id: 1, name: 1, slug: 1, code: 1, filterQuery: 1 } },
            ],
            as: formattedWidgetData[key].code,
          },
        });
        return;
      }

      const aggregationQueryPiplelines: any[] = [];
      collectionConfig = defaults.collections.find(
        (c) => c.collectionName === formattedWidgetData[key].collectionName
      );
      const aggregations = buildAggregations(collectionConfig?.aggregations, req);
      if (aggregations.length) {
        aggregationQueryPiplelines.push(...aggregations);
      }
      // Build piplelines with config
      aggregationQueryPiplelines.push(
        ...[
          {
            $match: {
              _id: {
                $in: tabIds,
              },
              ...(collectionConfig?.match || {}),
              ...(req?.defaultQueryFields || {}),
            },
          },
          {
            $project: {
              ...commonExcludedFields,
            },
          },
        ]
      );
      // Build Aggregation Query
      aggregationQuery.push({
        $lookup: {
          from: formattedWidgetData[key].collectionName,
          pipeline: aggregationQueryPiplelines,
          as: formattedWidgetData[key].code,
        },
      });
    }
  });
  return aggregationQuery;
}

export function buildSrcSetItem(uri: string, setItem: SrcSetItem) {
  const imageItemArr = uri?.split('/') || [];
  imageItemArr.splice(
    imageItemArr.length - 1,
    0,
    `${setItem.width}x${setItem.height}`
  );
  return imageItemArr.join('/');
}

export function AddSrcSetsToItems(widgetData: IWidgetSchema) {
  if (Array.isArray(widgetData.items) && widgetData.items.length > 0) {
    widgetData.items.forEach((item) => {
      if (Array.isArray(item.srcset) && item.srcset.length > 0 && item.image) {
        item.srcSets = item.srcset.reduce(
          (strArr: string[], setItem: SrcSetItem) => {
            const imageUri = buildSrcSetItem(item.image.uri, setItem);
            strArr.push(`${imageUri} ${setItem.screenSize}w`);
            return strArr;
          },
          []
        );

        item.srcSets = item.srcSets.join(', ');
      }
    });
  }
}

export const getCollectionModal = (collectionName: string, models: Models) => {
  let collectionModal: any;
  if (models && models[collectionName]) {
    collectionModal = models[collectionName];
  } else if (
    models &&
    models[collectionName.charAt(0).toUpperCase() + collectionName.slice(1)]
  ) {
    collectionModal =
      models[collectionName.charAt(0).toUpperCase() + collectionName.slice(1)];
  } else {
    try {
      collectionModal = model(collectionName);
    } catch (error) {
      if (!collectionModal) {
        const schema = new Schema({}, { strict: false });
        collectionModal = model(collectionName, schema, collectionName);
      }
    }
  }
  return collectionModal;
};

export const formatCollectionItems = (collectionItems: any[]) => {
  if (Array.isArray(collectionItems) && collectionItems.length === 0) return [];

  return collectionItems.map((item) => {
    if (item instanceof Types.ObjectId) return item;
    return new Types.ObjectId(item);
  });
};

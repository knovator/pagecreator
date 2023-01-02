import { models, model, Schema } from 'mongoose';
import { Widget } from '../models';
import { commonExcludedFields, defaults } from './defaults';
import {
  IWidgetData,
  IWidgetDataSchema,
  IWidgetSchema,
  SrcSetItem,
} from '../types';

export async function appendCollectionData(widgetData: IWidgetSchema[]) {
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
    const aggregationQueryCollectionItems = buildCollectionItemsQuery(newData);
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
        if (aggregationData[widget.code]) {
          return {
            ...widget,
            collectionItems: aggregationData[widget.code],
          };
        }
        return widget;
      });
    }
    const aggregationQueryTabs = buildTabCollectionItemsQuery(newData);
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
              collectionItems: tabItem.collectionItems.map(
                (collectionId) => collectionItemsObj[collectionId]
              ),
            };
          }),
        };
      });
    }
  }
  // returning widget data as it is if they do not have dynamic collection
  return widgetData;
}

function buildCollectionItemsQuery(formattedWidgetData: IWidgetData) {
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
  let collectionConfig, aggregationQueryPiplelines: any[];
  Object.keys(formattedWidgetData).forEach((key: string) => {
    if (
      formattedWidgetData[key].collectionItems &&
      formattedWidgetData[key].collectionItems.length > 0
    ) {
      collectionConfig = defaults.collections.find(
        (c) => c.collectionName === formattedWidgetData[key].collectionName
      );
      // Build piplelines with config
      aggregationQueryPiplelines = [
        {
          $match: {
            _id: {
              $in: formattedWidgetData[key].collectionItems,
            },
            ...(collectionConfig?.match || {}),
          },
        },
        {
          $project: {
            ...commonExcludedFields,
          },
        },
      ];
      // add project config if it exists
      if (collectionConfig?.project)
        aggregationQueryPiplelines.push({
          $project: collectionConfig?.project,
        });
      // add lookup config if it exists
      if (collectionConfig?.lookup)
        aggregationQueryPiplelines.push({
          $lookup: collectionConfig?.lookup,
        });
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

function buildTabCollectionItemsQuery(formattedWidgetData: IWidgetData) {
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
  let collectionConfig, aggregationQueryPiplelines: any[];
  Object.keys(formattedWidgetData).forEach((key: string) => {
    if (
      formattedWidgetData[key].tabs &&
      formattedWidgetData[key].tabs.length > 0
    ) {
      collectionConfig = defaults.collections.find(
        (c) => c.collectionName === formattedWidgetData[key].collectionName
      );
      // Build piplelines with config
      aggregationQueryPiplelines = [
        {
          $match: {
            _id: {
              $in: formattedWidgetData[key].tabs.reduce(
                (arr: string[], tabItem) => {
                  arr.push(...tabItem.collectionItems);
                  return arr;
                },
                []
              ),
            },
            ...(collectionConfig?.match || {}),
          },
        },
        {
          $project: {
            ...commonExcludedFields,
          },
        },
      ];
      // add project config if it exists
      if (collectionConfig?.project)
        aggregationQueryPiplelines.push({
          $project: collectionConfig?.project,
        });
      // add lookup config if it exists
      if (collectionConfig?.lookup)
        aggregationQueryPiplelines.push({
          $lookup: collectionConfig?.lookup,
        });
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

export const getCollectionModal = (collectionName: string) => {
  let collectionModal: any = models[collectionName];
  if (!collectionModal) {
    const schema = new Schema({}, { strict: false });
    collectionModal = model(collectionName, schema, collectionName);
  }
  return collectionModal;
};

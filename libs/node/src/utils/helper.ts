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
        };
      }
      return acc;
    },
    {}
  );
  if (Object.keys(newData).length > 0) {
    const aggregationQuery: any = [
      {
        $match: {
          _id: {
            $in: Object.values(newData).map(
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
    Object.keys(newData).forEach((key: string) => {
      collectionConfig = defaults.collections.find(
        (c) => c.collectionName === newData[key].collectionName
      );
      // Build piplelines with config
      aggregationQueryPiplelines = [
        {
          $match: {
            _id: {
              $in: newData[key].collectionItems,
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
          from: newData[key].collectionName,
          pipeline: aggregationQueryPiplelines,
          as: newData[key].code,
        },
      });
    });
    // getting collection data by populating widget
    let aggregationData: any = await Widget.aggregate(aggregationQuery);
    aggregationData = aggregationData.reduce((acc: any, aggregation: any) => {
      acc[aggregation.code] = aggregation[aggregation.code];
      return acc;
    }, {});
    // adding collection data to widgets
    return widgetData.map((widget: IWidgetSchema) => {
      if (aggregationData[widget.code]) {
        return {
          ...widget,
          collectionItems: aggregationData[widget.code],
        };
      }
      return widget;
    });
  }
  // returning widget data as it is if they do not have dynamic collection
  return widgetData;
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

export function AddSrcSetsToTiles(widgetData: IWidgetSchema) {
  if (Array.isArray(widgetData.tiles) && widgetData.tiles.length > 0) {
    widgetData.tiles.forEach((tile) => {
      if (Array.isArray(tile.srcset) && tile.srcset.length > 0 && tile.image) {
        tile.srcSets = tile.srcset.reduce(
          (strArr: string[], setItem: SrcSetItem) => {
            const imageUri = buildSrcSetItem(tile.image.uri, setItem);
            strArr.push(`${imageUri} ${setItem.screenSize}w`);
            return strArr;
          },
          []
        );

        tile.srcSets = tile.srcSets.join(', ');
      }
    });
  }
}
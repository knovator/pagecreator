import { Models, Types } from 'mongoose';
import {
  create,
  remove,
  update,
  list,
  bulkInsert,
  deleteAll,
  getOne,
  checkUnique,
} from '../services/dbService';
import { VALIDATION } from '../constants';
import {
  successResponse,
  createdDocumentResponse,
} from './../utils/responseHandlers';

import { commonExcludedFields, defaults } from '../utils/defaults';
import { formatCollectionItems, getCollectionModal } from '../utils/helper';
import {
  CollectionItem,
  IRequest,
  IResponse,
  WidgetTypes,
  TypesType,
  ItemsType,
} from '../types';
import {
  updateRedisWidget,
  updateWidgetPagesData,
} from '../services/dataService';

const catchAsync = (fn: any) => {
  return defaults.catchAsync(fn, 'Widget');
};

const getModals = (req: IRequest) => defaults.getModals(req);

const deleteItems = async (widgetId: string, models: Models) => {
  const { Item } = models;
  await deleteAll(Item, { widgetId: new Types.ObjectId(widgetId) });
};
const createItems = async (
  itemsData: any[],
  widgetId: string,
  models: Models
) => {
  const { Item, SrcSet } = models;
  itemsData = itemsData.map((item: any) => ({
    ...item,
    _id: new Types.ObjectId(),
    widgetId,
  }));
  const srcSetItems = itemsData.reduce((acc: any[], item: any) => {
    if (Array.isArray(item.srcset)) {
      acc.push(
        ...item.srcset.map((srcSetItem: any) => ({
          ...srcSetItem,
          itemId: item._id,
        }))
      );
      delete item.srcset;
    }
    return acc;
  }, []);
  await bulkInsert(Item, itemsData);
  await bulkInsert(SrcSet, srcSetItems);
};

export const createWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const models = getModals(req);
    const data = req.body;
    let items = [];

    await checkUnique({
      Modal: models['Widget'],
      uniqueField: 'code',
      value: data.code,
      errorMessage: VALIDATION.WIDGET_EXISTS
    });

    if ('items' in data) {
      items = JSON.parse(JSON.stringify(data.items));
      delete data.items;
    }
    const widget = await create(models['Widget'], data);
    if (items.length > 0) {
      await createItems(items, widget._id, models);
    }

    const widgetData = widget.toJSON ? widget.toJSON() : widget;

    // Update Redis cache for the new widget
    updateRedisWidget(widgetData.code, models);

    // Populate collectionItems if it's a 'pages' collection widget
    if (
      widgetData.collectionName === 'pages' &&
      Array.isArray(widgetData.collectionItems) &&
      widgetData.collectionItems.length > 0
    ) {
      const { Page } = models;
      const pages = await Page.find(
        { _id: { $in: widgetData.collectionItems } },
        'name code slug _id filterQuery'
      ).lean();

      // Preserve order
      widgetData.collectionItems = widgetData.collectionItems
        .map((id: any) =>
          pages.find((p: any) => p._id.toString() === id.toString())
        )
        .filter((p: any) => !!p);
    }

    res.message = req?.i18n?.t('widget.create');
    return createdDocumentResponse(widgetData, res);
  }
);

export const updateWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const models = getModals(req);
    const data = req.body;
    const _id = req.params['id'];
    let items = [];
    if ('items' in data) {
      items = JSON.parse(JSON.stringify(data.items));
      delete data.items;
    }
    let updatedWidget = await update(models['Widget'], { _id }, data);
    if (items.length > 0 && updatedWidget) {
      await deleteItems(_id, models);
      await createItems(items, updatedWidget._id, models);
    }
    if (updatedWidget) {
      if (updatedWidget.toJSON) {
        updatedWidget = updatedWidget.toJSON();
      }
      updateRedisWidget(updatedWidget.code, models);
      updateWidgetPagesData([updatedWidget.id], models);

      // Populate collectionItems if it's a 'pages' collection widget
      if (
        updatedWidget.collectionName === 'pages' &&
        Array.isArray(updatedWidget.collectionItems) &&
        updatedWidget.collectionItems.length > 0
      ) {
        const { Page } = models;
        const pages = await Page.find(
          { _id: { $in: updatedWidget.collectionItems } },
          'name code slug _id filterQuery'
        ).lean();

        // Preserve order
        updatedWidget.collectionItems = updatedWidget.collectionItems
          .map((id: any) =>
            pages.find((p: any) => p._id.toString() === id.toString())
          )
          .filter((p: any) => !!p);
      }
    }
    res.message = req?.i18n?.t('widget.update');
    return successResponse(updatedWidget, res);
  }
);

export const deleteWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const models = getModals(req);
    await deleteItems(req.params['id'], models);
    const _id = new Types.ObjectId(req.params['id']);
    const deletedWidget = await remove(models['Widget'], { _id });
    if (deletedWidget) {
      updateRedisWidget(deletedWidget.code, models);
      updateWidgetPagesData([deletedWidget.id], models);
    }
    res.message = req?.i18n?.t('widget.delete');
    return successResponse(deletedWidget, res);
  }
);

export const getWidgets = catchAsync(async (req: IRequest, res: IResponse) => {
  const { Widget } = getModals(req);
  const search = req.body.search || '';
  const { collectionItems } = req.body;
  const { page, limit, sort } = req.body.options;
  const all =
    (typeof req.body.all !== 'undefined' && req.body.all === true) || false;
  const isActive =
    typeof req.body.isActive !== 'undefined'
      ? req.body.isActive || false
      : null;
  const customOptions = {
    pagination: !all,
    sort,
    select: 'name code isActive canDel',
    ...(page && limit ? { page, limit } : {}),
  };
  const orOptions: any = [];
  if (search) {
    orOptions.push({ name: { $regex: search, $options: 'i' } });
    orOptions.push({ code: { $regex: search, $options: 'i' } });
  } else {
    orOptions.push({});
  }
  if (Array.isArray(collectionItems) && collectionItems.length) {
    orOptions.push({ _id: { $in: collectionItems } });
  }
  const query = {
    isDeleted: false,
    isActive: { $in: isActive === null ? [true, false] : [isActive] },
    $or: orOptions,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const notifications = await list(Widget, query, customOptions);

  // Populate collectionItems for 'pages' collection
  if (Array.isArray(notifications.docs) && notifications.docs.length > 0) {
    const { Page } = getModals(req);
    await Promise.all(
      notifications.docs.map(async (widget: any) => {
        if (
          widget.collectionName === 'pages' &&
          Array.isArray(widget.collectionItems) &&
          widget.collectionItems.length > 0
        ) {
          const pages = await Page.find(
            { _id: { $in: widget.collectionItems } },
            'name code slug _id filterQuery'
          ).lean();

          // Preserve order of collectionItems
          widget.collectionItems = widget.collectionItems
            .map((id: any) =>
              pages.find((p: any) => p._id.toString() === id.toString())
            )
            .filter((p: any) => !!p);
        }
      })
    );
  }

  res.message = req?.i18n?.t('widget.getAll');
  return successResponse(notifications, res);
});

export const getSingleWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const { Widget, Item } = getModals(req);
    const _id = req.params['id'];
    const widget = await (
      await getOne(Widget, { _id, isDeleted: true })
    ).toJSON();
    widget['items'] = await Item.aggregate([
      {
        $match: {
          widgetId: new Types.ObjectId(_id),
          isDeleted: false,
        },
      },
      {
        $project: {
          ...commonExcludedFields,
        },
      },
      ...(defaults.languages && defaults.languages?.length > 0
        ? defaults.languages.reduce((arr: any[], lng) => {
          arr.push(
            {
              $lookup: {
                from: 'file',
                let: { imgsId: { $toObjectId: `$imgs.${lng.code}` } },
                as: `imgs.${lng.code}`,
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$imgsId'],
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
              $unwind: {
                path: `$imgs.${lng.code}`,
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
            $unwind: {
              path: '$img',
              preserveNullAndEmptyArrays: true,
            },
          },
        ]),
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
    ]);
    res.message = req?.i18n?.t('widget.getOne');
    return successResponse(widget, res);
  }
);

export const partialUpdateWidget = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const models = getModals(req);
    const data = req.body;
    const _id = req.params['id'];
    const updatedWidget = await update(models['Widget'], { _id }, data);
    if (updatedWidget) {
      updateRedisWidget(updatedWidget.code, models);
      updateWidgetPagesData([updatedWidget.id], models);
    }
    res.message = req?.i18n?.t('widget.partialUpdate');
    return successResponse(updatedWidget, res);
  }
);

export const getItemsTypes = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const itemsTypes: TypesType[] = [
      {
        value: Object.keys(ItemsType)[0],
        label: Object.values(ItemsType)[0],
      },
      {
        value: 'pages',
        label: 'Pages',
      },
    ];
    defaults.collections.forEach((item: CollectionItem) => {
      itemsTypes.push({
        value: item.collectionName,
        label: item.title,
      });
    });
    res.message = req?.i18n?.t('widget.getItemsTypes');
    return successResponse(itemsTypes, res);
  }
);

export const getWidgetTypes = catchAsync(
  async (req: IRequest, res: IResponse) => {
    const widgetTypes: any[] = Object.entries(WidgetTypes).map((e) => ({
      label: e[1],
      value: e[0],
    }));
    if (
      Array.isArray(defaults.customWidgetTypes) &&
      defaults.customWidgetTypes.length > 0
    ) {
      widgetTypes.push(...defaults.customWidgetTypes);
    }
    res.message = req?.i18n?.t('widget.getWidgetTypes');
    return successResponse(widgetTypes, res);
  }
);

export const getCollectionData = catchAsync(async (req: IRequest, res: IResponse) => {
  const models = getModals(req);
  const { search, collectionName, collectionItems } = req.body;

  // Handle built-in "pages" collection
  if (collectionName === 'pages') {
    const { Page } = models;
    let limit = 10;
    if (Array.isArray(collectionItems))
      limit = Math.max(collectionItems.length, limit);

    const orOptions: any = [];
    let addFieldOptions: any = {};

    if (search) {
      orOptions.push({ name: { $regex: search, $options: 'i' } });
      orOptions.push({ slug: { $regex: search, $options: 'i' } });
    } else {
      orOptions.push({});
    }

    if (Array.isArray(collectionItems) && collectionItems.length) {
      addFieldOptions = {
        __order: {
          $indexOfArray: [collectionItems, { $toString: '$_id' }],
        },
      };
      orOptions.push({ _id: { $in: formatCollectionItems(collectionItems) } });
    }

    const query: any = {
      isDeleted: false,
      $or: orOptions,
    };

    const collectionData = await Page.aggregate([
      { $match: query },
      { $addFields: addFieldOptions },
      { $sort: { __order: -1 } },
      { $limit: limit },
      { $project: { _id: 1, name: 1, slug: 1, code: 1, filterQuery: 1 } },
    ]);

    res.message = req?.i18n?.t('widget.getCollectionData');
    return successResponse({ docs: collectionData }, res);
  }

  const collectionItem: CollectionItem | undefined = defaults.collections.find(
    (collection) => collection.collectionName === collectionName
  );
  if (!collectionItem) {
    throw new Error(`No collection is specified with ${collectionName}`);
  }
  let limit = collectionItem.searchLimit || 10;
  if (Array.isArray(collectionItems))
    limit = Math.max(collectionItems.length, limit);
  // setting up mongoose model
  const TempModel = getCollectionModal(collectionName, models);
  // fetching data
  let query: any = collectionItem.filters || {};
  const orOptions: any = [];
  let addFieldOptions: any = {};
  if (
    search &&
    Array.isArray(collectionItem.searchColumns) &&
    collectionItem.searchColumns.length
  ) {
    collectionItem.searchColumns.forEach((column) =>
      orOptions.push({
        [column]: {
          $regex: search,
          $options: 'i',
        },
      })
    );
  } else {
    orOptions.push({});
  }
  if (Array.isArray(collectionItems) && collectionItems.length) {
    addFieldOptions = {
      __order: {
        $indexOfArray: [
          collectionItems,
          {
            $toString: '$_id',
          },
        ],
      },
    };
    orOptions.push({ _id: { $in: formatCollectionItems(collectionItems) } });
  }
  if (orOptions.length > 0) {
    query = {
      ...query,
      $or: orOptions,
    };
  }
  const collectionData = await TempModel.aggregate([
    ...(Array.isArray(collectionItem.aggregations)
      ? collectionItem.aggregations
      : []),
    {
      $match: query,
    },
    { $addFields: addFieldOptions },
    {
      $sort: {
        __order: -1,
      },
    },
    {
      $limit: limit,
    },
  ]);
  res.message = req?.i18n?.t('widget.getCollectionData');
  return successResponse({ docs: collectionData }, res);
});

export const getLanguages = catchAsync(async (req: any, res: any) => {
  return successResponse(
    Array.isArray(defaults.languages) ? defaults.languages : [],
    res
  );
});

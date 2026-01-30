import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IWidgetSchema, WidgetTypes, ItemsType } from '../types';
import { defaults } from '../utils/defaults';

const languageTitlesSchema =
  defaults.languages?.reduce((acc: any, lang) => {
    acc[lang.code] = { type: String, required: true };
    return acc;
  }, {}) || {};

const WidgetSchema = new Schema<IWidgetSchema>({
  name: String,
  code: String,
  autoPlay: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  widgetTitle: String,
  widgetTitles: languageTitlesSchema,
  webPerRow: Number,
  mobilePerRow: Number,
  tabletPerRow: Number,
  collectionName: String,
  backgroundColor: String,
  collectionItems: [{ type: Types.ObjectId, refPath: 'collectionName' }],
  itemsType: {
    type: String,
    default: ItemsType.Image,
    required: true,
  },
  widgetType: {
    type: String,
    default: WidgetTypes.FixedCard,
    required: true,
  },
  tabs: [
    {
      name: String,
      names: languageTitlesSchema,
      collectionItems: [{ type: Types.ObjectId, refPath: 'collectionName' }],
    },
  ],
  canDel: {
    type: Boolean,
    default: true,
  },
  textContent: {type: String},
  htmlContent: {type: String}
});

WidgetSchema.plugin(softDeletePlugin);
WidgetSchema.plugin(mongoosePaginate);

const Widget = model(
  'Widget',
  WidgetSchema
) as unknown as IModel<IWidgetSchema>;

export { Widget, WidgetSchema };

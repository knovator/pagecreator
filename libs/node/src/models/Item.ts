import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IItemSchema, ItemTypes } from '../types';
import { defaults } from '../utils/defaults';

const titlesSchema =
  defaults.languages?.reduce((acc: any, lang) => {
    acc[lang.code] = { type: String, required: true };
    return acc;
  }, {}) || {};

const imagesSchema =
  defaults.languages?.reduce((acc: any, lang) => {
    acc[lang.code] = { type: Schema.Types.ObjectId, ref: 'file' };
    return acc;
  }, {}) || {};

const altTextsSchema =
  defaults.languages?.reduce((acc: any, lang) => {
    acc[lang.code] = { type: String };
    return acc;
  }, {}) || {};

const ItemSchema = new Schema<IItemSchema>({
  widgetId: {
    type: Types.ObjectId,
    ref: 'Widget',
  },
  title: String,
  titles: titlesSchema,
  subtitle: String,
  subtitles: titlesSchema,
  altText: String,
  altTexts: altTextsSchema,
  link: String,
  sequence: Number,
  img: { type: Schema.Types.ObjectId, ref: 'file' },
  imgs: imagesSchema,
  itemType: {
    type: String,
    enum: Object.values(ItemTypes),
    default: ItemTypes.Web,
    required: true,
  },
});

ItemSchema.plugin(softDeletePlugin);
ItemSchema.plugin(mongoosePaginate);

const Item = model('Item', ItemSchema) as unknown as IModel<IItemSchema>;

export { Item, ItemSchema };

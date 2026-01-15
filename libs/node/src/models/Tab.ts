import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, ITabSchema } from '../types';
import { defaults } from '../utils/defaults';

const namesSchema =
  defaults.languages?.reduce((acc: any, lang) => {
    acc[lang.code] = { type: String, required: true };
    return acc;
  }, {}) || {};

const TabSchema = new Schema<ITabSchema>({
  name: String,
  names: namesSchema,
  widgetId: {
    type: Types.ObjectId,
    ref: 'Widget',
  },
  collectionItems: [{ type: Types.ObjectId }],
});

TabSchema.plugin(softDeletePlugin);
TabSchema.plugin(mongoosePaginate);

const Tab = model('Tab', TabSchema) as unknown as IModel<ITabSchema>;

export { Tab, TabSchema };

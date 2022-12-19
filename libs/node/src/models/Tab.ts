import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, ITabSchema } from '../types';

const TabSchema = new Schema<ITabSchema>({
  name: String,
  widgetId: {
    type: Types.ObjectId,
    ref: 'Widget',
  },
  collectionItems: [{ type: Types.ObjectId }],
});

TabSchema.plugin(softDeletePlugin);
TabSchema.plugin(mongoosePaginate);

const Tab = model('Tab', TabSchema) as unknown as IModel<ITabSchema>;

export default Tab;

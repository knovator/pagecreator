import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IWidgetSchema, WidgetTypes, ItemsType } from '../types';

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
    enum: Object.values(WidgetTypes),
    default: WidgetTypes.FixedCard,
    required: true,
  },
  tabs: [
    {
      name: String,
      collectionItems: [{ type: Types.ObjectId, refPath: 'collectionName' }],
    },
  ],
});

WidgetSchema.plugin(softDeletePlugin);
WidgetSchema.plugin(mongoosePaginate);

const Widget = model(
  'Widget',
  WidgetSchema
) as unknown as IModel<IWidgetSchema>;

export default Widget;

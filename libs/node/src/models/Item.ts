import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IItemSchema, ItemTypes } from '../types';

const ItemSchema = new Schema<IItemSchema>({
  widgetId: {
    type: Types.ObjectId,
    ref: 'Widget',
  },
  title: String,
  subtitle: String,
  altText: String,
  link: String,
  sequence: Number,
  img: { type: Schema.Types.ObjectId, ref: 'file' },
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

export default Item;

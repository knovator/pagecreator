import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, ITileSchema, TileTypes } from '../types';

const TileSchema = new Schema<ITileSchema>({
  widgetId: {
    type: Types.ObjectId,
    ref: 'Widget',
  },
  title: String,
  altText: String,
  link: String,
  sequence: Number,
  img: { type: Schema.Types.ObjectId, ref: 'file' },
  tileType: {
    type: String,
    enum: Object.values(TileTypes),
    default: TileTypes.Web,
    required: true,
  },
});

TileSchema.plugin(softDeletePlugin);
TileSchema.plugin(mongoosePaginate);

const Tile = model('Tile', TileSchema) as unknown as IModel<ITileSchema>;

export default Tile;

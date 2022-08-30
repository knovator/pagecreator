import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ITileSchema, TileTypes, IModel } from '@pagecreator/api-interfaces';
import { softDeletePlugin } from '../plugins/softDelete';

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

const Tile = model('Tile', TileSchema) as IModel<ITileSchema>;

export default Tile;

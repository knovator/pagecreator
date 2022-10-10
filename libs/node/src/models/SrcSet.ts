import { Schema, model, Types, Model } from 'mongoose';
import { ISrcSetSchema } from '../types';

const SrcSetSchema = new Schema<ISrcSetSchema>({
  width: Number,
  height: Number,
  screenSize: Number,
  tileId: {
    type: Types.ObjectId,
    ref: 'Tile',
  },
});

const SrcSet: Model<ISrcSetSchema> = model('SrcSet', SrcSetSchema);

export default SrcSet;

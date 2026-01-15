import { Schema, model, Types, Model } from 'mongoose';
import { ISrcSetSchema } from '../types';

const SrcSetSchema = new Schema<ISrcSetSchema>({
  width: Number,
  height: Number,
  screenSize: Number,
  itemId: {
    type: Types.ObjectId,
    ref: 'Item',
  },
});

const SrcSet: Model<ISrcSetSchema> = model('SrcSet', SrcSetSchema);

export { SrcSet, SrcSetSchema };

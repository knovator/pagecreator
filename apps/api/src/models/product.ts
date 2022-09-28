import { Schema, model, Model, Types } from 'mongoose';

export interface ProductSchema {
  name: string;
  price: number;
  description: string;
  category: any;
  img: any;
}

const productSchema = new Schema<ProductSchema>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  img: {
    type: Types.ObjectId,
    ref: 'file',
  },
});

productSchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export const Product: Model<ProductSchema> = model(
  'product',
  productSchema,
  'product'
);

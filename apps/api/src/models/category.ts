import { Schema, model, Model, Types } from 'mongoose';

export interface CategorySchema {
  name: string;
  img: any;
}

const categorySchema = new Schema<CategorySchema>({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: Types.ObjectId,
    ref: 'file',
  },
});

categorySchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export const Category: Model<CategorySchema> = model(
  'category',
  categorySchema,
  'category'
);

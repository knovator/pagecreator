import { Schema, model, Model } from 'mongoose';

interface FileSchema {
  name: string;
  type: string;
  slug: string;
  uri: string;
  mime_type: string;
  file_size: string;
  title: string;
  alt: string;
  module: string;
  link: string;
  width: number;
  height: number;
  status: string;
  isVerified: boolean;
}

const schema = new Schema<FileSchema>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  uri: {
    type: String,
  },
  mime_type: {
    type: String,
  },
  file_size: {
    type: String,
  },
  title: {
    type: String,
  },
  alt: {
    type: String,
  },
  module: {
    type: String,
    default: null,
  },
  link: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  status: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
});

schema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export const File: Model<FileSchema> = model('file', schema, 'file');

import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const blogSchema = new Schema(
  {
    title: String,
    name: String,
    description: String,
    slug: String,
    coverImage: String,
    isPublished: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { strict: false, timestamps: true }
);

blogSchema.plugin(mongoosePaginate);
const Blog = model('blogs', blogSchema);
export default Blog;

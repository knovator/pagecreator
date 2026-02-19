import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const blogCategorySchema = new Schema(
  {
    nm: String,
    slug: String,
    description: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: Schema.Types.ObjectId,
    updatedBy: [Schema.Types.ObjectId],
  },
  { timestamps: true }
);

blogCategorySchema.plugin(mongoosePaginate);
const BlogCategory = model('blogCategory', blogCategorySchema, 'blogCategory');
export default BlogCategory;

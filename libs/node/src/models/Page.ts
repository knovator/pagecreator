import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IPageSchema } from '../types';

const PageSchema = new Schema<IPageSchema>({
  name: String,
  code: String,
  slug: String,
  widgets: [{ type: Types.ObjectId, ref: 'Widget' }],
});

PageSchema.plugin(softDeletePlugin);
PageSchema.plugin(mongoosePaginate);

const Page = model('Page', PageSchema) as unknown as IModel<IPageSchema>;

export default Page;

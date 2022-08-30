import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from '../plugins/softDelete';
import { IModel, IPageSchema } from '@pagecreator/api-interfaces';

const PageSchema = new Schema<IPageSchema>({
  name: String,
  code: String,
  widgets: [{ type: Types.ObjectId, ref: 'Widget' }],
});

PageSchema.plugin(softDeletePlugin);
PageSchema.plugin(mongoosePaginate);

const Page = model('Page', PageSchema) as IModel<IPageSchema>;

export default Page;

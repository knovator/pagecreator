import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const tempSchema = new Schema({}, { strict: false });
tempSchema.plugin(mongoosePaginate);
const TempModel = model('notifications', tempSchema);
export default TempModel;

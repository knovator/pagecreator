import { Schema, model } from 'mongoose';
const tempSchema = new Schema({}, { strict: false });
const TempModel = model('notifications', tempSchema);
export default TempModel;

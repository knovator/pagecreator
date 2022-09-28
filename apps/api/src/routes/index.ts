import express from 'express';
import FileUploadRoute from './file/fileuploadRoute';
import CategoryRoute from './category';
import ProductRoute from './product';

const router = express.Router();
router.use('/media', FileUploadRoute);
router.use('/category', CategoryRoute);
router.use('/product', ProductRoute);

export default router;

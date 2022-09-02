import express from 'express';
import { fileUpload, removeFile } from './fileuploadController';

const router = express.Router();
router.post('/upload', fileUpload);
router.delete('/:id/delete', removeFile);

export default router;

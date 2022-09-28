import express from 'express';
import { addCategory, getCategories } from './controller';

const router = express.Router();
router.post('/', addCategory);
router.get('/', getCategories);

export default router;

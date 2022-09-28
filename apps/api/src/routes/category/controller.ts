import { Request, Response } from 'express';
import { Category } from '../../models/category';

export const addCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().populate(['img']);
    res.status(200).send(categories);
  } catch (error) {
    throw new Error(error.message);
  }
};

import { Request, Response } from 'express';
import { Product } from '../../models/product';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate(['category', 'img']);
    res.status(200).json(products);
  } catch (error) {
    throw new Error(error.message);
  }
};

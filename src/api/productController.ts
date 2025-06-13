import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export const createProductController = async (req: Request, res: Response) => {
  const { name, description, sku, barcode, price, userId } = req.body;

  if (!name || !description || !sku || !barcode || !price || !userId) {
    res.status(400).json({ message: 'Missing required product fields' });
    return;
  }

  try {
    const newProduct = await ProductService.createProduct(name, description, sku, barcode, price, userId);
    if (!newProduct) {
      res.status(500).json({ message: 'Error creating product' });
      return;
    }
    res.status(201).json(newProduct);
    return;
  } catch (error) {
    console.error('Error in createProductController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const getProductsByUserIdController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const products = await ProductService.getProductsByUserId(userId);
    if (!products) {
      res.status(404).json({ message: 'No products found for this user' });
      return;
    }
    res.status(200).json(products);
    return;
  } catch (error) {
    console.error('Error in getProductsByUserIdController:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}; 
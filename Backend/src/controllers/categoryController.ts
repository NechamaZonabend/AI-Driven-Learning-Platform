import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await categoryService.createCategory(name);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

export const getCategoryByNane = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await categoryService.getCategoryByNane(name);
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Category not found' });
  }
};

export default { getAllCategories, createCategory, getCategoryByNane };
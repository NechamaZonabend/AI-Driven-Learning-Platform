import { Request, Response } from 'express';
import { subCategoryService } from '../services/subCategoryService';

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.body;
    const subCategory = await subCategoryService.createSubCategory({ name, categoryId });
    res.status(201).json({ success: true, data: subCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create sub-category' });
  }
};

export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const subCategoryId = Number(req.params.subCategoryId);
    const subCategory = await subCategoryService.getSubCategoryById(subCategoryId);
    res.json({ success: true, data: subCategory });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Sub-category not found' });
  }
};

export const getAllSubCategories = async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const subCategories = await subCategoryService.getAllSubCategories(categoryId);
    res.json({ success: true, data: subCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch sub-categories' });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategoryId = Number(req.params.subCategoryId);
    const result = await subCategoryService.deleteSubCategory(subCategoryId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Failed to delete sub-category' });
  }
};

export default {
  createSubCategory,
  getSubCategoryById,
    getAllSubCategories,
  deleteSubCategory,
};
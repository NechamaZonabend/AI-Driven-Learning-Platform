import { Router } from 'express';
import {
  getAllSubCategories,
  createSubCategory,
  getSubCategoryById,
  deleteSubCategory
} from '../controllers/subCategoryController';

const router = Router();

router.get('/', getAllSubCategories);
router.post('/', createSubCategory);
// router.get('/subCategoryId', getSubCategoryById);
// router.delete('/subCategoryId', deleteSubCategory);

export default router;
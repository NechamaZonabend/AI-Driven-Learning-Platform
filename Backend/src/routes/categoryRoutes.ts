import { Router } from 'express';
import { getAllCategories, createCategory, getCategoryByNane} from '../controllers/categoryController';

const router = Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.get('/getCategoryByNane', getCategoryByNane);

export default router;
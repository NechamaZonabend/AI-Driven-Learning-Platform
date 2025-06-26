import express from 'express';
import { 
  createPrompt,
  getPromptsByUser,
  getAllPrompts,
} from '../controllers/promptController';

const router = express.Router();

// יצירת prompt חדש
router.post('/', createPrompt);

// שליפת כל ה-prompts (עם אפשרות לפילטרים)
router.get('/', getAllPrompts);

// שליפת prompts לפי משתמש
router.get('/user/:userId', getPromptsByUser);


export { router as promptRoutes };
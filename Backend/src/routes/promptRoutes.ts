import { Router } from 'express';
import { createPrompt, getPromptsByUser, getAllPrompts } from '../controllers/promptController';

const router = Router();

router.post('/', createPrompt);
router.get('/', getAllPrompts);
router.get('/user/:userId', getPromptsByUser);

export default router;
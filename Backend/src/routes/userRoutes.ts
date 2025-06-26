
import { Router } from 'express';
import {authController} from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getAllUsers);
router.get('/profile', authController.getProfile);
export default router;
import { Router } from 'express';
import {UserController} from '../controllers/userController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/users', UserController.getAllUsers);
router.get('/profile', UserController.getProfile);
export default router;
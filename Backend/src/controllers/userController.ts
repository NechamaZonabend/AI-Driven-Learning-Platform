import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { CreateUserRequest, LoginRequest, ApiResponse } from '../backend_types';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
}

class userController {
  register = async (req: Request, res: Response): Promise<void> => {
    const userData: CreateUserRequest = req.body;

    const result = await userService.createUser(userData);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  };

  login =async (req: Request, res: Response): Promise<void> => {
    const loginData: LoginRequest = req.body;

    const result = await userService.loginUser(loginData);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful',
    };

    res.status(200).json(response);
  };

  getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const user = await userService.getUserById(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'Profile retrieved successfully',
    };

    res.status(200).json(response);
  };

  
  validateToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: {
        valid: true,
        user: req.user,
      },
      message: 'Token is valid',
    };

    res.status(200).json(response);
  };
 getAllUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        const result = await userService.getAllUsers(page, limit);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};
}

export const UserController = new userController();
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { CreateUserRequest, LoginRequest, AuthResponse } from '../backend_types';

class UserService {
  async createUser(userData: CreateUserRequest): Promise<Omit<AuthResponse, 'token'>> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { phone: userData.phone },
      });

      if (existingUser) {
        throw new Error('User with this phone number already exists');
      }

       //  If trying to register as admin, check if an admin already exists     
         if (userData.role === 'ADMIN') {
        const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (existingAdmin) {
          throw new Error('An admin already exists in the system');
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          phone: userData.phone,
          password: hashedPassword,
          role: userData.role || 'USER', 
        },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
        },
      });

      logger.info(`New user created: ${user.phone}`);
      return {
        user,
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async loginUser(loginData: LoginRequest): Promise<Omit<AuthResponse, 'token'>> {
    try {
      const user = await prisma.user.findUnique({
        where: { phone: loginData.phone },
      });

      if (!user) {
        throw new Error('Invalid phone number or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid phone number or password');
      }

      logger.info(`User logged in: ${user.phone}`);

      return {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        }
      };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  }

  async getUserById(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }
async deleteUser(userId: number) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}
  async getAllUsers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                prompts: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.user.count(),
      ]);

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
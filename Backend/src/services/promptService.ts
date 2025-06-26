import { prisma } from '../config/database';
import { aiService } from './aiService';
import { logger } from '../utils/logger';
import { CreatePromptRequest } from '../backend_types';

class PromptService {
  async createPrompt(userId: number, promptData: CreatePromptRequest) {
    try {
      // ודא שתת-הקטגוריה שייכת לקטגוריה
      const subCategory = await prisma.subCategory.findFirst({
        where: {
          id: promptData.subCategoryId,
          categoryId: promptData.categoryId,
        },
        include: {
          category: true,
        },
      });

      if (!subCategory) {
        throw new Error(`Sub-category with ID ${promptData.subCategoryId} does not exist for category ID ${promptData.categoryId}`);
      }

      // קריאה ל-AI
      const aiResponse = await aiService.generateLesson({
        prompt: promptData.prompt,
        category: subCategory.category.name,
        subCategory: subCategory.name,
      });

      // שמירה במסד הנתונים
      const prompt = await prisma.prompt.create({
        data: {
          userId,
          categoryId: promptData.categoryId,
          subCategoryId: promptData.subCategoryId,
          prompt: promptData.prompt,
          response: aiResponse.content,
        },
        include: {
          category: { select: { id: true, name: true } },
          subCategory: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
      });

      logger.info(`New prompt created for user ${userId} in ${subCategory.category.name}/${subCategory.name}`);
      return prompt;
    } catch (error) {
      logger.error('Error creating prompt:', error);
      throw error;
    }
  }

  async getUserPrompts(userId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [prompts, total] = await Promise.all([
        prisma.prompt.findMany({
          where: { userId },
          skip,
          take: limit,
          include: {
            category: { select: { id: true, name: true } },
            subCategory: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.prompt.count({ where: { userId } }),
      ]);

      return {
        data: prompts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching user prompts:', error);
      throw error;
    }
  }

  async getAllPrompts(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [prompts, total] = await Promise.all([
        prisma.prompt.findMany({
          skip,
          take: limit,
          include: {
            category: { select: { id: true, name: true } },
            subCategory: { select: { id: true, name: true } },
            user: { select: { id: true, name: true, phone: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.prompt.count(),
      ]);

      return {
        data: prompts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching prompts:', error);
      throw error;
    }
  }
}

export const promptService = new PromptService();
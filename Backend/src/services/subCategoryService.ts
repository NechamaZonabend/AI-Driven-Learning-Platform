import { prisma } from '../config/database';
import { logger } from '../utils/logger';

interface CreateSubCategoryRequest {
  name: string;
  categoryId: number;
}

class SubCategoryService {
  async createSubCategory(data: CreateSubCategoryRequest) {
    try {
      // Check if subcategory with the same name exists in the category
      const existing = await prisma.subCategory.findFirst({
        where: {
          name: data.name,
          categoryId: data.categoryId,
        },
      });
      if (existing) {
        throw new Error('SubCategory with this name already exists in the category');
      }

      const subCategory = await prisma.subCategory.create({
        data,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
      logger.info(`New subcategory created: ${data.name} (categoryId: ${data.categoryId})`);
      return subCategory;
    } catch (error) {
      logger.error('Error creating subcategory:', error);
      throw error;
    }
  }

  async getSubCategoryById(subCategoryId: number) {
    try {
      const subCategory = await prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
      if (!subCategory) {
        throw new Error('SubCategory not found');
      }
      return subCategory;
    } catch (error) {
      logger.error('Error fetching subcategory:', error);
      throw error;
    }
  }

  async getAllSubCategories(categoryId?: number) {
    try {
      const where = categoryId ? { categoryId } : {};
      const subCategories = await prisma.subCategory.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      logger.info('Fetched all subcategories');
      return subCategories;
    } catch (error) {
      logger.error('Error fetching subcategories:', error);
      throw error;
    }
  }

  async deleteSubCategory(subCategoryId: number) {
    try {
      const existing = await prisma.subCategory.findUnique({
        where: { id: subCategoryId },
      });
      if (!existing) {
        throw new Error('SubCategory not found');
      }
      await prisma.subCategory.delete({
        where: { id: subCategoryId },
      });
      logger.info(`Subcategory deleted: ${subCategoryId}`);
      return { message: 'SubCategory deleted successfully' };
    } catch (error) {
      logger.error('Error deleting subcategory:', error);
      throw error;
    }
  }
}

export const subCategoryService = new SubCategoryService();
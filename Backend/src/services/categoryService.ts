import { prisma } from '../config/database';
import { logger } from '../utils/logger';

class CategoryService {
  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          subCategories: {
            orderBy: {
              name: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return categories;
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryByNane(name: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { name },
        include: {
          subCategories: {
            orderBy: {
              name: 'asc',
            },
          },
        },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      logger.error('Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(name: string) {
    try {
      // Check if category already exists
      const existingCategory = await prisma.category.findUnique({
        where: { name },
      });

      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      const category = await prisma.category.create({
        data: { name },
        include: {
          subCategories: true,
        },
      });

      logger.info(`New category created: ${name}`);
      return category;
    } catch (error) {
      logger.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, name: string) {
    try {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new Error('Category not found');
      }

      // Check if new name already exists (excluding current category)
      const nameExists = await prisma.category.findFirst({
        where: {
          name,
          id: { not: id },
        },
      });

      if (nameExists) {
        throw new Error('Category with this name already exists');
      }

      const category = await prisma.category.update({
        where: { id },
        data: { name },
        include: {
          subCategories: {
            orderBy: {
              name: 'asc',
            },
          },
        },
      });

      logger.info(`Category updated: ${name}`);
      return category;
    } catch (error) {
      logger.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: number) {
    try {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              prompts: true,
              subCategories: true,
            },
          },
        },
      });

      if (!existingCategory) {
        throw new Error('Category not found');
      }

      // Check if category has associated prompts
      if (existingCategory._count.prompts > 0) {
        throw new Error('Cannot delete category with existing prompts');
      }

      await prisma.category.delete({
        where: { id },
      });

      logger.info(`Category deleted: ${existingCategory.name}`);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      logger.error('Error deleting category:', error);
      throw error;
    }
  }

//   async createSubCategory(name: string, categoryId: number) {
//     try {
//       // Check if parent category exists
//       const parentCategory = await prisma.category.findUnique({
//         where: { id: categoryId },
//       });

//       if (!parentCategory) {
//         throw new Error('Parent category not found');
//       }

//       // Check if subcategory already exists in this category
//       const existingSubCategory = await prisma.subCategory.findFirst({
//         where: {
//           name,
//           categoryId,
//         },
//       });

//       if (existingSubCategory) {
//         throw new Error('Sub-category with this name already exists in this category');
//       }

//       const subCategory = await prisma.subCategory.create({
//         data: {
//           name,
//           categoryId,
//         },
//         include: {
//           category: true,
//         },
//       });

//       logger.info(`New sub-category created: ${name} in ${parentCategory.name}`);
//       return subCategory;
//     } catch (error) {
//       logger.error('Error creating sub-category:', error);
//       throw error;
//     }
//   }

//   async updateSubCategory(id: number, name: string) {
//     try {
//       // Check if subcategory exists
//       const existingSubCategory = await prisma.subCategory.findUnique({
//         where: { id },
//         include: { category: true },
//       });

//       if (!existingSubCategory) {
//         throw new Error('Sub-category not found');
//       }

//       // Check if new name already exists in the same category (excluding current subcategory)
//       const nameExists = await prisma.subCategory.findFirst({
//         where: {
//           name,
//           categoryId: existingSubCategory.categoryId,
//           id: { not: id },
//         },
//       });

//       if (nameExists) {
//         throw new Error('Sub-category with this name already exists in this category');
//       }

//       const subCategory = await prisma.subCategory.update({
//         where: { id },
//         data: { name },
//         include: {
//           category: true,
//         },
//       });

//       logger.info(`Sub-category updated: ${name}`);
//       return subCategory;
//     } catch (error) {
//       logger.error('Error updating sub-category:', error);
//       throw error;
//     }
//   }

//   async deleteSubCategory(id: number) {
//     try {
//       // Check if subcategory exists
//       const existingSubCategory = await prisma.subCategory.findUnique({
//         where: { id },
//         include: {
//           _count: {
//             select: {
//               prompts: true,
//             },
//           },
//         },
//       });

//       if (!existingSubCategory) {
//         throw new Error('Sub-category not found');
//       }

//       // Check if subcategory has associated prompts
//       if (existingSubCategory._count.prompts > 0) {
//         throw new Error('Cannot delete sub-category with existing prompts');
//       }

//       await prisma.subCategory.delete({
//         where: { id },
//       });

//       logger.info(`Sub-category deleted: ${existingSubCategory.name}`);
//       return { message: 'Sub-category deleted successfully' };
//     } catch (error) {
//       logger.error('Error deleting sub-category:', error);
//       throw error;
//     }
//   }
 }

 export const categoryService = new CategoryService();
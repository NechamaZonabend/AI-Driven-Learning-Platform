import { Request, Response } from 'express';
import { promptService } from '../services/promptService';

export const createPrompt = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.body.userId || req.body.user_id);
    const categoryId = Number(req.body.categoryId || req.body.category_id);
    const subCategoryId = Number(req.body.subCategoryId || req.body.sub_category_id);
    const { prompt } = req.body;
    const newPrompt = await promptService.createPrompt(userId, { categoryId, subCategoryId, prompt });
    res.status(201).json({ success: true, data: newPrompt });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error)?.message || error?.toString() || 'Failed to create prompt'
    });
  }
};

export const getPromptsByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const prompts = await promptService.getUserPrompts(userId, page, limit);
    res.json({ success: true, data: prompts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch prompts' });
  }
};

export const getAllPrompts = async (req: Request, res: Response) => {
  try {
    const prompts = await promptService.getAllPrompts();
    res.json({ success: true, data: prompts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch prompts' });
  }
};

export default { createPrompt, getPromptsByUser, getAllPrompts };

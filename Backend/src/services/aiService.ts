import OpenAI from 'openai';
import config from '../config/config';
import { logger } from '../utils/logger';
import { AIServiceRequest, AIServiceResponse } from '../backend_types';

class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  private createSystemPrompt(category: string, subCategory: string): string {
    return `You are a world-class expert educator in ${category}, specializing in ${subCategory}.
Your task is to provide a comprehensive, in-depth, and highly informative answer to the user's prompt.
- Use clear explanations, advanced insights, and practical examples.
- Structure your answer with headers, bullet points, and numbered lists where appropriate.
- Reference relevant theories, facts, or historical context if possible.
- Make the answer engaging and suitable for learners at all levels.
- If the topic is complex, break it down step by step.

Format your response as a detailed lesson that includes:
1. An introduction to the topic
2. Key concepts and deep explanations
3. Real-world examples or analogies
4. Additional tips or interesting facts
5. A summary of the main points

Aim for a rich, thorough answer of at least 400-600 words.`;
  }

  async generateLesson(request: AIServiceRequest): Promise<AIServiceResponse> {
    try {
      logger.info(`Generating lesson for category: ${request.category}, subcategory: ${request.subCategory}`);

      const systemPrompt = this.createSystemPrompt(request.category, request.subCategory);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.prompt },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      logger.info('Successfully generated lesson');

      return {
        content,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      logger.error('Error generating lesson with OpenAI:', error);
      return this.getFallbackResponse(request);
    }
  }

  private getFallbackResponse(request: AIServiceRequest): AIServiceResponse {
    const fallbackContent = `
# ${request.subCategory} Lesson

Thank you for your interest in learning about ${request.subCategory} in ${request.category}.

## Your Question
"${request.prompt}"

## Lesson Overview
This is a comprehensive topic that covers several important aspects. Here are the key points to consider:

### Key Concepts
- Understanding the fundamentals of ${request.subCategory}
- Exploring the relationship with ${request.category}
- Practical applications and examples

### Important Points
1. Start with the basics and build understanding gradually
2. Practice regularly to reinforce learning
3. Connect new concepts to what you already know

### Next Steps
- Continue exploring related topics in ${request.category}
- Look for practical applications of what you've learned
- Don't hesitate to ask more specific questions

*Note: This lesson was generated using a fallback system. For more detailed and personalized lessons, please ensure your AI service is properly configured.*
    `;

    return {
      content: fallbackContent.trim(),
    };
  }
}

export const aiService = new AIService();
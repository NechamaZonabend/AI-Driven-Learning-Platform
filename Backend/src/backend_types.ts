// backend/src/types/index.ts

export interface CreateUserRequest {
  name: string;
  phone: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  id: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
  token: string;
}

export interface CreatePromptRequest {
  categoryId: number;
  subCategoryId: number;
  prompt: string;
}

export interface PromptResponse {
  id: number;
  userId: number;
  categoryId: number;
  subCategoryId: number;
  prompt: string;
  response: string;
  createdAt: Date;
  category: {
    id: number;
    name: string;
  };
  subCategory: {
    id: number;
    name: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
}

// OpenAI Types
export interface AIServiceRequest {
  prompt: string;
  category: string;
  subCategory: string;
}

export interface AIServiceResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
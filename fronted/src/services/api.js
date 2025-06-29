import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// --- User API ---

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
};

// --- Category API ---

export const getAllCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories`, categoryData);
    return response.data;
};

export const getCategoryByNane = async (name) => {
    const response = await axios.post(`${API_URL}/categories/getCategoryByNane`, { name });
    return response.data;
};

// --- SubCategory API ---

export const getAllSubCategories = async (categoryId) => {
    const url = categoryId
        ? `${API_URL}/sub-categories?categoryId=${categoryId}`
        : `${API_URL}/sub-categories`;
    const response = await axios.get(url);
    return response.data;
};

export const createSubCategory = async (subCategoryData) => {
    const response = await axios.post(`${API_URL}/sub-categories`, subCategoryData);
    return response.data;
};

export const getSubCategoryById = async (subCategoryId) => {
    const response = await axios.get(`${API_URL}/sub-categories/${subCategoryId}`);
    return response.data;
};

export const deleteSubCategory = async (subCategoryId) => {
    const response = await axios.delete(`${API_URL}/sub-categories/${subCategoryId}`);
    return response.data;
};

// --- Prompt API ---

export const createPrompt = async (promptData) => {
    const response = await axios.post(`${API_URL}/prompts`, promptData);
    return response.data;
};

export const getAllPrompts = async (userId) => {
    if (!userId) throw new Error('userId is required');
    const response = await axios.get(`${API_URL}/prompts/user/${userId}`);
    return response.data;
};

// --- Admin API ---

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users/users`);
    return response.data;
};

export const getAllPromptsAdmin = async () => {
    const response = await axios.get(`${API_URL}/prompts`);
    return response.data;
};

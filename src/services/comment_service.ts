import axios from "axios";
import { Comment, CreateCommentRequest, UpdateCommentRequest } from "../types";
import { API_BASE_URL } from "../config";

export const commentService = {
  getByNewsId: async (newsId: number): Promise<Comment[]> => {
    const response = await axios.get(`${API_BASE_URL}/news/${newsId}/comments`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<Comment[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}/comments`
    );
    return response.data;
  },

  create: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await axios.post(`${API_BASE_URL}/comments/`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateCommentRequest): Promise<Comment> => {
    const response = await axios.put(`${API_BASE_URL}/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/comments/${id}`);
  },
};

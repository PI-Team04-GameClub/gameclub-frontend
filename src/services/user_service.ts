import axios from "axios";
import { Friend } from "../types";
import { API_BASE_URL } from "../config";
import { authService } from "./auth_service";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return Promise.reject(error);
  }
);

export const userService = {
  getFriends: async (userId: number): Promise<Friend[]> => {
    const response = await axiosInstance.get(`/users/${userId}/friends`);
    return response.data;
  },

  removeFriend: async (friendRequestId: number): Promise<void> => {
    await axiosInstance.delete(`/friend-requests/${friendRequestId}`);
  },
};

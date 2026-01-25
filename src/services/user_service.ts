import axios from "axios";
import { User, UpdateUserRequest } from "../types";
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
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
};

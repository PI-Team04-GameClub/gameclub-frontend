import axios from "axios";
import { Friend, FriendRequest, FriendRequestFormData } from "../types";
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
  },
);

export const profileService = {
  // Friends
  getFriends: async (): Promise<Friend[]> => {
    const response = await axiosInstance.get("/profile/friends");
    return response.data;
  },

  removeFriend: async (friendId: number): Promise<void> => {
    await axiosInstance.delete(`/profile/friends/${friendId}`);
  },

  // Friend Requests
  getSentRequests: async (): Promise<FriendRequest[]> => {
    const response = await axiosInstance.get("/profile/requests/sent");
    return response.data;
  },

  getReceivedRequests: async (): Promise<FriendRequest[]> => {
    const response = await axiosInstance.get("/profile/requests/received");
    return response.data;
  },

  sendFriendRequest: async (data: FriendRequestFormData): Promise<FriendRequest> => {
    const response = await axiosInstance.post("/profile/requests", data);
    return response.data;
  },

  acceptRequest: async (requestId: number): Promise<void> => {
    await axiosInstance.post(`/profile/requests/${requestId}/accept`);
  },

  rejectRequest: async (requestId: number): Promise<void> => {
    await axiosInstance.post(`/profile/requests/${requestId}/reject`);
  },

  cancelRequest: async (requestId: number): Promise<void> => {
    await axiosInstance.delete(`/profile/requests/${requestId}`);
  },
};

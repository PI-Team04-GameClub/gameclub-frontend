import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import axios from "axios";
import { profileService } from "./profile_service";
import { Friend, FriendRequest } from "../types";

vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      get: mockAxiosInstance.get,
      post: mockAxiosInstance.post,
      delete: mockAxiosInstance.delete,
    },
  };
});

vi.mock("./auth_service", () => ({
  authService: {
    getToken: vi.fn(() => "test-token"),
  },
}));

const mockedAxios = axios as unknown as {
  create: Mocked<typeof axios.create>;
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("profileService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFriends", () => {
    it("returns friends list from API", async () => {
      const mockFriends: Friend[] = [
        {
          id: 1,
          userId: 1,
          friendId: 2,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockFriends });

      const result = await profileService.getFriends();

      expect(result).toEqual(mockFriends);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(profileService.getFriends()).rejects.toThrow("Network error");
    });
  });

  describe("removeFriend", () => {
    it("removes friend via API", async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await profileService.removeFriend(1);

      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error("Delete error"));

      await expect(profileService.removeFriend(1)).rejects.toThrow("Delete error");
    });
  });

  describe("getSentRequests", () => {
    it("returns sent requests from API", async () => {
      const mockRequests: FriendRequest[] = [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          senderFirstName: "Current",
          senderLastName: "User",
          senderEmail: "current@example.com",
          receiverFirstName: "John",
          receiverLastName: "Doe",
          receiverEmail: "john@example.com",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockRequests });

      const result = await profileService.getSentRequests();

      expect(result).toEqual(mockRequests);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(profileService.getSentRequests()).rejects.toThrow("Network error");
    });
  });

  describe("getReceivedRequests", () => {
    it("returns received requests from API", async () => {
      const mockRequests: FriendRequest[] = [
        {
          id: 1,
          senderId: 2,
          receiverId: 1,
          senderFirstName: "John",
          senderLastName: "Doe",
          senderEmail: "john@example.com",
          receiverFirstName: "Current",
          receiverLastName: "User",
          receiverEmail: "current@example.com",
          status: "pending",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockRequests });

      const result = await profileService.getReceivedRequests();

      expect(result).toEqual(mockRequests);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(profileService.getReceivedRequests()).rejects.toThrow("Network error");
    });
  });

  describe("sendFriendRequest", () => {
    it("sends friend request via API", async () => {
      const requestData = { receiverId: 2 };
      const mockResponse: FriendRequest = {
        id: 1,
        senderId: 1,
        receiverId: 2,
        senderFirstName: "Current",
        senderLastName: "User",
        senderEmail: "current@example.com",
        receiverFirstName: "John",
        receiverLastName: "Doe",
        receiverEmail: "john@example.com",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await profileService.sendFriendRequest(requestData);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Send error"));

      await expect(profileService.sendFriendRequest({ receiverId: 2 })).rejects.toThrow(
        "Send error",
      );
    });
  });

  describe("acceptRequest", () => {
    it("accepts friend request via API", async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await profileService.acceptRequest(1);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Accept error"));

      await expect(profileService.acceptRequest(1)).rejects.toThrow("Accept error");
    });
  });

  describe("rejectRequest", () => {
    it("rejects friend request via API", async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await profileService.rejectRequest(1);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Reject error"));

      await expect(profileService.rejectRequest(1)).rejects.toThrow("Reject error");
    });
  });

  describe("cancelRequest", () => {
    it("cancels friend request via API", async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await profileService.cancelRequest(1);

      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error("Cancel error"));

      await expect(profileService.cancelRequest(1)).rejects.toThrow("Cancel error");
    });
  });
});

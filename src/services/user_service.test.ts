import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import axios from "axios";
import { userService } from "./user_service";
import { Friend } from "../types";

vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
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
  delete: ReturnType<typeof vi.fn>;
};

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFriends", () => {
    it("returns friends list from API", async () => {
      // Arrange
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

      // Act
      const result = await userService.getFriends(1);

      // Assert
      expect(result).toEqual(mockFriends);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      // Act & Assert
      await expect(userService.getFriends(1)).rejects.toThrow("Network error");
    });
  });

  describe("removeFriend", () => {
    it("removes friend via API", async () => {
      // Arrange
      mockedAxios.delete.mockResolvedValueOnce({});

      // Act
      await userService.removeFriend(1);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.delete.mockRejectedValueOnce(new Error("Delete error"));

      // Act & Assert
      await expect(userService.removeFriend(1)).rejects.toThrow("Delete error");
    });
  });
});

import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import axios from "axios";
import { userService } from "./user_service";
import { User } from "../types";

vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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
      put: mockAxiosInstance.put,
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
  put: ReturnType<typeof vi.fn>;
};

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("returns users list from API", async () => {
      // Arrange
      const mockUsers: User[] = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockUsers });

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      // Act & Assert
      await expect(userService.getAllUsers()).rejects.toThrow("Network error");
    });
  });

  describe("getUserById", () => {
    it("returns user from API", async () => {
      // Arrange
      const mockUser: User = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      // Act
      const result = await userService.getUserById(1);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error("Not found"));

      // Act & Assert
      await expect(userService.getUserById(1)).rejects.toThrow("Not found");
    });
  });

  describe("createUser", () => {
    it("creates user via API", async () => {
      // Arrange
      const createData = {
        email: "new@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
      };
      const mockUser: User = {
        id: 1,
        first_name: "New",
        last_name: "User",
        email: "new@example.com",
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockUser });

      // Act
      const result = await userService.createUser(createData);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.post.mockRejectedValueOnce(new Error("Validation error"));

      // Act & Assert
      await expect(
        userService.createUser({
          email: "new@example.com",
          password: "pass",
          firstName: "New",
        })
      ).rejects.toThrow("Validation error");
    });
  });

  describe("updateUser", () => {
    it("updates user via API", async () => {
      // Arrange
      const updateData = { firstName: "Updated" };
      const mockUser: User = {
        id: 1,
        first_name: "Updated",
        last_name: "Doe",
        email: "john@example.com",
      };
      mockedAxios.put.mockResolvedValueOnce({ data: mockUser });

      // Act
      const result = await userService.updateUser(1, updateData);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.put.mockRejectedValueOnce(new Error("Update error"));

      // Act & Assert
      await expect(
        userService.updateUser(1, { firstName: "Updated" })
      ).rejects.toThrow("Update error");
    });
  });
});

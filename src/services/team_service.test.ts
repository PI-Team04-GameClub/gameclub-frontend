import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import axios from "axios";
import { teamService } from "./team_service";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("teamService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns teams from API", async () => {
      // Arrange
      const mockTeams = [
        { id: 1, name: "Team A" },
        { id: 2, name: "Team B" },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockTeams });

      // Act
      const result = await teamService.getAll();

      // Assert
      expect(result).toEqual(mockTeams);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("throws error when API fails", async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      // Act & Assert
      await expect(teamService.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("getById", () => {
    it("returns single team from API", async () => {
      // Arrange
      const mockTeam = { id: 1, name: "Team A" };
      mockedAxios.get.mockResolvedValueOnce({ data: mockTeam });

      // Act
      const result = await teamService.getById(1);

      // Assert
      expect(result).toEqual(mockTeam);
    });
  });

  describe("create", () => {
    it("creates team via API", async () => {
      // Arrange
      const newTeam = { name: "New Team" };
      const createdTeam = { id: 3, name: "New Team" };
      mockedAxios.post.mockResolvedValueOnce({ data: createdTeam });

      // Act
      const result = await teamService.create(newTeam);

      // Assert
      expect(result).toEqual(createdTeam);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("updates team via API", async () => {
      // Arrange
      const updateData = { name: "Updated Team" };
      const updatedTeam = { id: 1, name: "Updated Team" };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedTeam });

      // Act
      const result = await teamService.update(1, updateData);

      // Assert
      expect(result).toEqual(updatedTeam);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("deletes team via API", async () => {
      // Arrange
      mockedAxios.delete.mockResolvedValueOnce({});

      // Act
      await teamService.delete(1);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });
  });
});

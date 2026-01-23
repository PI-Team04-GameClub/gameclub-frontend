import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import axios from "axios";
import { gameService } from "./game_service";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("gameService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns games from API", async () => {
      // Arrange
      const mockGames = [
        {
          id: 1,
          name: "Chess",
          description: "Classic game",
          numberOfPlayers: 2,
        },
        {
          id: 2,
          name: "Monopoly",
          description: "Board game",
          numberOfPlayers: 4,
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockGames });

      // Act
      const result = await gameService.getAll();

      // Assert
      expect(result).toEqual(mockGames);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    it("returns single game from API", async () => {
      // Arrange
      const mockGame = {
        id: 1,
        name: "Chess",
        description: "Classic",
        numberOfPlayers: 2,
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockGame });

      // Act
      const result = await gameService.getById(1);

      // Assert
      expect(result).toEqual(mockGame);
    });
  });

  describe("create", () => {
    it("creates game via API", async () => {
      // Arrange
      const newGame = {
        name: "New Game",
        description: "Fun game",
        numberOfPlayers: 3,
      };
      const createdGame = { id: 3, ...newGame };
      mockedAxios.post.mockResolvedValueOnce({ data: createdGame });

      // Act
      const result = await gameService.create(newGame);

      // Assert
      expect(result).toEqual(createdGame);
    });
  });

  describe("update", () => {
    it("updates game via API", async () => {
      // Arrange
      const updateData = {
        name: "Updated Game",
        description: "Updated",
        numberOfPlayers: 5,
      };
      const updatedGame = { id: 1, ...updateData };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedGame });

      // Act
      const result = await gameService.update(1, updateData);

      // Assert
      expect(result).toEqual(updatedGame);
    });
  });

  describe("delete", () => {
    it("deletes game via API", async () => {
      // Arrange
      mockedAxios.delete.mockResolvedValueOnce({});

      // Act
      await gameService.delete(1);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });
  });
});

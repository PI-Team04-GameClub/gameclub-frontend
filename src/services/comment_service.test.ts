import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import axios from "axios";
import { commentService } from "./comment_service";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("commentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getByNewsId", () => {
    it("returns comments for a news item", async () => {
      // Arrange
      const mockComments = [
        {
          id: 1,
          content: "Great article!",
          user_id: 1,
          user_name: "John Doe",
          news_id: 1,
          news_title: "News 1",
          created_at: "2024-01-01 10:00:00",
          updated_at: "2024-01-01 10:00:00",
        },
        {
          id: 2,
          content: "Very informative",
          user_id: 2,
          user_name: "Jane Smith",
          news_id: 1,
          news_title: "News 1",
          created_at: "2024-01-01 11:00:00",
          updated_at: "2024-01-01 11:00:00",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockComments });

      // Act
      const result = await commentService.getByNewsId(1);

      // Assert
      expect(result).toEqual(mockComments);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/news/1/comments")
      );
    });
  });

  describe("getByUserId", () => {
    it("returns comments for a user", async () => {
      // Arrange
      const mockComments = [
        {
          id: 1,
          content: "My comment",
          user_id: 1,
          user_name: "John Doe",
          news_id: 1,
          news_title: "News 1",
          created_at: "2024-01-01 10:00:00",
          updated_at: "2024-01-01 10:00:00",
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockComments });

      // Act
      const result = await commentService.getByUserId(1);

      // Assert
      expect(result).toEqual(mockComments);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/users/1/comments")
      );
    });
  });

  describe("create", () => {
    it("creates a comment via API", async () => {
      // Arrange
      const newComment = {
        content: "New comment",
        user_id: 1,
        news_id: 1,
      };
      const createdComment = {
        id: 3,
        content: "New comment",
        user_id: 1,
        user_name: "John Doe",
        news_id: 1,
        news_title: "News 1",
        created_at: "2024-01-01 12:00:00",
        updated_at: "2024-01-01 12:00:00",
      };
      mockedAxios.post.mockResolvedValueOnce({ data: createdComment });

      // Act
      const result = await commentService.create(newComment);

      // Assert
      expect(result).toEqual(createdComment);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/comments/"),
        newComment
      );
    });
  });

  describe("update", () => {
    it("updates a comment via API", async () => {
      // Arrange
      const updateData = {
        content: "Updated comment",
      };
      const updatedComment = {
        id: 1,
        content: "Updated comment",
        user_id: 1,
        user_name: "John Doe",
        news_id: 1,
        news_title: "News 1",
        created_at: "2024-01-01 10:00:00",
        updated_at: "2024-01-01 13:00:00",
      };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedComment });

      // Act
      const result = await commentService.update(1, updateData);

      // Assert
      expect(result).toEqual(updatedComment);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining("/comments/1"),
        updateData
      );
    });
  });

  describe("delete", () => {
    it("deletes a comment via API", async () => {
      // Arrange
      mockedAxios.delete.mockResolvedValueOnce({});

      // Act
      await commentService.delete(1);

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/comments/1")
      );
    });
  });
});

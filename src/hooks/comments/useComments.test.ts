import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useComments } from "./useComments";
import { commentService } from "../../services/comment_service";
import { authService } from "../../services/auth_service";

vi.mock("../../services/comment_service", () => ({
  commentService: {
    getByNewsId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../services/auth_service", () => ({
  authService: {
    getUser: vi.fn(),
  },
}));

describe("useComments", () => {
  const mockComments = [
    {
      id: 1,
      content: "Test comment 1",
      user_id: 1,
      user_name: "John Doe",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 10:00:00",
      updated_at: "2024-01-01 10:00:00",
    },
    {
      id: 2,
      content: "Test comment 2",
      user_id: 2,
      user_name: "Jane Smith",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 11:00:00",
      updated_at: "2024-01-01 11:00:00",
    },
  ];

  const mockUser = {
    id: 1,
    email: "test@test.com",
    first_name: "John",
    last_name: "Doe",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(commentService.getByNewsId).mockResolvedValue(mockComments);
    vi.mocked(authService.getUser).mockReturnValue(mockUser);
  });

  it("loads comments when loadComments is called", async () => {
    const { result } = renderHook(() => useComments(1));

    await act(async () => {
      await result.current.loadComments();
    });

    await waitFor(() => {
      expect(result.current.comments).toEqual(mockComments);
    });
    expect(commentService.getByNewsId).toHaveBeenCalledWith(1);
  });

  it("creates a new comment", async () => {
    const newComment = {
      id: 3,
      content: "New comment",
      user_id: 1,
      user_name: "John Doe",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 12:00:00",
      updated_at: "2024-01-01 12:00:00",
    };
    vi.mocked(commentService.create).mockResolvedValue(newComment);

    const { result } = renderHook(() => useComments(1));

    await act(async () => {
      await result.current.handleSubmit("New comment");
    });

    expect(commentService.create).toHaveBeenCalledWith({
      content: "New comment",
      user_id: 1,
      news_id: 1,
    });
  });

  it("updates an existing comment", async () => {
    const updatedComment = {
      ...mockComments[0],
      content: "Updated content",
    };
    vi.mocked(commentService.update).mockResolvedValue(updatedComment);

    const { result } = renderHook(() => useComments(1));

    // First select a comment for editing
    act(() => {
      result.current.handleEdit(mockComments[0]);
    });

    // Then submit the update
    await act(async () => {
      await result.current.handleSubmit("Updated content");
    });

    expect(commentService.update).toHaveBeenCalledWith(1, {
      content: "Updated content",
    });
  });

  it("opens modal when handleCreate is called", () => {
    const { result } = renderHook(() => useComments(1));

    act(() => {
      result.current.handleCreate();
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.selectedComment).toBeUndefined();
  });

  it("opens modal with selected comment when handleEdit is called", () => {
    const { result } = renderHook(() => useComments(1));

    act(() => {
      result.current.handleEdit(mockComments[0]);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.selectedComment).toEqual(mockComments[0]);
  });

  it("deletes a comment", async () => {
    vi.mocked(commentService.delete).mockResolvedValue();

    const { result } = renderHook(() => useComments(1));

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(commentService.delete).toHaveBeenCalledWith(1);
  });

  it("clears selectedComment after submit", async () => {
    const newComment = {
      id: 3,
      content: "New comment",
      user_id: 1,
      user_name: "John Doe",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 12:00:00",
      updated_at: "2024-01-01 12:00:00",
    };
    vi.mocked(commentService.create).mockResolvedValue(newComment);

    const { result } = renderHook(() => useComments(1));

    // First select a comment for editing
    act(() => {
      result.current.handleEdit(mockComments[0]);
    });

    expect(result.current.selectedComment).toEqual(mockComments[0]);

    // Submit clears selectedComment
    await act(async () => {
      await result.current.handleSubmit("New comment");
    });

    expect(result.current.selectedComment).toBeUndefined();
  });
});

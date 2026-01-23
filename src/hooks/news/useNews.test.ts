import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useNews } from "./useNews";
import { newsService } from "../../services/news_service";
import { authService } from "../../services/auth_service";

vi.mock("../../services/news_service", () => ({
  newsService: {
    getAll: vi.fn(),
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

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useDisclosure: vi.fn(() => {
      let isOpen = false;
      return {
        isOpen,
        onOpen: vi.fn(() => {
          isOpen = true;
        }),
        onClose: vi.fn(() => {
          isOpen = false;
        }),
      };
    }),
  };
});

describe("useNews", () => {
  const mockNews = [
    {
      id: 1,
      title: "News 1",
      description: "Description 1",
      author: "John Doe",
      date: "2024-01-01",
    },
    {
      id: 2,
      title: "News 2",
      description: "Description 2",
      author: "Jane Doe",
      date: "2024-01-02",
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
    vi.mocked(newsService.getAll).mockResolvedValue(mockNews);
    vi.mocked(authService.getUser).mockReturnValue(mockUser);
  });

  it("loads news on mount", async () => {
    // Act
    const { result } = renderHook(() => useNews());

    // Assert
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });
    expect(newsService.getAll).toHaveBeenCalled();
  });

  it("handles create action", async () => {
    // Arrange
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });

    // Act
    act(() => {
      result.current.handleCreate();
    });

    // Assert
    expect(result.current.selectedNews).toBeUndefined();
  });

  it("handles edit action", async () => {
    // Arrange
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });

    // Act
    act(() => {
      result.current.handleEdit(mockNews[0]);
    });

    // Assert
    expect(result.current.selectedNews).toEqual(mockNews[0]);
  });

  it("handles delete click", async () => {
    // Arrange
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });

    // Act
    act(() => {
      result.current.handleDeleteClick(1);
    });

    // Assert
    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles submit for creating new news", async () => {
    // Arrange
    vi.mocked(newsService.create).mockResolvedValue({
      id: 3,
      title: "New News",
      description: "New Description",
      author: "John Doe",
      date: "2024-01-03",
    });
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });
    const newNewsData = {
      title: "New News",
      description: "New Description",
    };

    // Act
    await act(async () => {
      await result.current.handleSubmit(newNewsData);
    });

    // Assert
    expect(newsService.create).toHaveBeenCalledWith({
      ...newNewsData,
      authorId: mockUser.id,
    });
  });

  it("handles submit for updating existing news", async () => {
    // Arrange
    vi.mocked(newsService.update).mockResolvedValue({
      id: 1,
      title: "Updated",
      description: "Updated",
      author: "John Doe",
      date: "2024-01-01",
    });
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });
    act(() => {
      result.current.handleEdit(mockNews[0]);
    });
    const updateData = {
      title: "Updated",
      description: "Updated",
    };

    // Act
    await act(async () => {
      await result.current.handleSubmit(updateData);
    });

    // Assert
    expect(newsService.update).toHaveBeenCalledWith(1, {
      ...updateData,
      authorId: mockUser.id,
    });
  });

  it("handles delete action", async () => {
    // Arrange
    vi.mocked(newsService.delete).mockResolvedValue(undefined);
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });
    act(() => {
      result.current.handleDeleteClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleDelete();
    });

    // Assert
    expect(newsService.delete).toHaveBeenCalledWith(1);
  });

  it("does not submit when no user is logged in", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(authService.getUser).mockReturnValue(null);
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });

    // Act
    await act(async () => {
      await result.current.handleSubmit({
        title: "Test",
        description: "Test",
      });
    });

    // Assert
    expect(newsService.create).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith("No user logged in");
    consoleError.mockRestore();
  });

  it("handles error when loading news", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(newsService.getAll).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const { result } = renderHook(() => useNews());

    // Assert
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading news:",
        expect.any(Error)
      );
    });
    expect(result.current.newsItems).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when saving news", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(newsService.create).mockRejectedValueOnce(
      new Error("Save error")
    );
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });

    // Act
    await act(async () => {
      await result.current.handleSubmit({
        title: "Test",
        description: "Test",
      });
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error saving news:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("handles error when deleting news", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(newsService.delete).mockRejectedValueOnce(
      new Error("Delete error")
    );
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });
    act(() => {
      result.current.handleDeleteClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleDelete();
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error deleting news:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not delete when newsToDelete is null", async () => {
    // Arrange
    const { result } = renderHook(() => useNews());
    await waitFor(() => {
      expect(result.current.newsItems).toEqual(mockNews);
    });

    // Act
    await act(async () => {
      await result.current.handleDelete();
    });

    // Assert
    expect(newsService.delete).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFriends } from "./useFriends";
import { userService } from "../../../services/user_service";
import { authService } from "../../../services/auth_service";

vi.mock("../../../services/user_service", () => ({
  userService: {
    getFriends: vi.fn(),
    removeFriend: vi.fn(),
  },
}));

vi.mock("../../../services/auth_service", () => ({
  authService: {
    getUser: vi.fn(() => ({
      id: 1,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
    })),
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

describe("useFriends", () => {
  const mockFriends = [
    {
      id: 1,
      userId: 1,
      friendId: 2,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      userId: 1,
      friendId: 3,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      createdAt: "2024-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userService.getFriends).mockResolvedValue(mockFriends);
  });

  it("loads friends on mount", async () => {
    // Act
    const { result } = renderHook(() => useFriends());

    // Assert
    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });
    expect(userService.getFriends).toHaveBeenCalledWith(1);
  });

  it("handles remove click", async () => {
    // Arrange
    const { result } = renderHook(() => useFriends());
    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    // Act
    act(() => {
      result.current.handleRemoveClick(1);
    });

    // Assert
    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles remove action", async () => {
    // Arrange
    vi.mocked(userService.removeFriend).mockResolvedValue(undefined);
    const { result } = renderHook(() => useFriends());
    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });
    act(() => {
      result.current.handleRemoveClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleRemove();
    });

    // Assert
    expect(userService.removeFriend).toHaveBeenCalledWith(1);
    expect(userService.getFriends).toHaveBeenCalledTimes(2);
  });

  it("handles error when loading friends", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(userService.getFriends).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const { result } = renderHook(() => useFriends());

    // Assert
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading friends:",
        expect.any(Error)
      );
    });
    expect(result.current.friends).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when removing friend", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(userService.removeFriend).mockRejectedValueOnce(
      new Error("Remove error")
    );
    const { result } = renderHook(() => useFriends());
    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });
    act(() => {
      result.current.handleRemoveClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleRemove();
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error removing friend:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not remove when friendToRemove is null", async () => {
    // Arrange
    const { result } = renderHook(() => useFriends());
    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    // Act
    await act(async () => {
      await result.current.handleRemove();
    });

    // Assert
    expect(userService.removeFriend).not.toHaveBeenCalled();
  });

  it("does not load friends when user is null", async () => {
    // Arrange
    vi.mocked(authService.getUser).mockReturnValueOnce(null);

    // Act
    const { result } = renderHook(() => useFriends());

    // Assert
    await waitFor(() => {
      expect(result.current.friends).toEqual([]);
    });
    expect(userService.getFriends).not.toHaveBeenCalled();
  });
});

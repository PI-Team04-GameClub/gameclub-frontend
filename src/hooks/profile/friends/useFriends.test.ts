import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFriends } from "./useFriends";
import { profileService } from "../../../services/profile_service";

vi.mock("../../../services/profile_service", () => ({
  profileService: {
    getFriends: vi.fn(),
    removeFriend: vi.fn(),
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
    vi.mocked(profileService.getFriends).mockResolvedValue(mockFriends);
  });

  it("loads friends on mount", async () => {
    const { result } = renderHook(() => useFriends());

    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    expect(profileService.getFriends).toHaveBeenCalled();
  });

  it("handles remove click", async () => {
    const { result } = renderHook(() => useFriends());

    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    act(() => {
      result.current.handleRemoveClick(1);
    });

    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles remove action", async () => {
    vi.mocked(profileService.removeFriend).mockResolvedValue(undefined);

    const { result } = renderHook(() => useFriends());

    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    act(() => {
      result.current.handleRemoveClick(1);
    });

    await act(async () => {
      await result.current.handleRemove();
    });

    expect(profileService.removeFriend).toHaveBeenCalledWith(1);
    expect(profileService.getFriends).toHaveBeenCalledTimes(2);
  });

  it("handles error when loading friends", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(profileService.getFriends).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useFriends());

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
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(profileService.removeFriend).mockRejectedValueOnce(
      new Error("Remove error")
    );

    const { result } = renderHook(() => useFriends());

    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    act(() => {
      result.current.handleRemoveClick(1);
    });

    await act(async () => {
      await result.current.handleRemove();
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error removing friend:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not remove when friendToRemove is null", async () => {
    const { result } = renderHook(() => useFriends());

    await waitFor(() => {
      expect(result.current.friends).toEqual(mockFriends);
    });

    await act(async () => {
      await result.current.handleRemove();
    });

    expect(profileService.removeFriend).not.toHaveBeenCalled();
  });
});

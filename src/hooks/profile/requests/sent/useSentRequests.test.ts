import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSentRequests } from "./useSentRequests";
import { friendRequestService } from "../../../../services/friend_request_service";
import { authService } from "../../../../services/auth_service";

vi.mock("../../../../services/friend_request_service", () => ({
  friendRequestService: {
    getSentRequests: vi.fn(),
    cancelRequest: vi.fn(),
  },
}));

vi.mock("../../../../services/auth_service", () => ({
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

describe("useSentRequests", () => {
  const mockSentRequests = [
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
      status: "pending" as const,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      senderId: 1,
      receiverId: 3,
      senderFirstName: "Current",
      senderLastName: "User",
      senderEmail: "current@example.com",
      receiverFirstName: "Jane",
      receiverLastName: "Smith",
      receiverEmail: "jane@example.com",
      status: "pending" as const,
      createdAt: "2024-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(friendRequestService.getSentRequests).mockResolvedValue(
      mockSentRequests
    );
  });

  it("loads sent requests on mount", async () => {
    // Act
    const { result } = renderHook(() => useSentRequests());

    // Assert
    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });
    expect(friendRequestService.getSentRequests).toHaveBeenCalledWith(1);
  });

  it("handles cancel click", async () => {
    // Arrange
    const { result } = renderHook(() => useSentRequests());
    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    // Act
    act(() => {
      result.current.handleCancelClick(1);
    });

    // Assert
    expect(result.current.isCancelDialogOpen).toBeDefined();
  });

  it("handles cancel action", async () => {
    // Arrange
    vi.mocked(friendRequestService.cancelRequest).mockResolvedValue(undefined);
    const { result } = renderHook(() => useSentRequests());
    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });
    act(() => {
      result.current.handleCancelClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleCancel();
    });

    // Assert
    expect(friendRequestService.cancelRequest).toHaveBeenCalledWith(1);
    expect(friendRequestService.getSentRequests).toHaveBeenCalledTimes(2);
  });

  it("handles error when loading sent requests", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(friendRequestService.getSentRequests).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const { result } = renderHook(() => useSentRequests());

    // Assert
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading sent requests:",
        expect.any(Error)
      );
    });
    expect(result.current.sentRequests).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when canceling request", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(friendRequestService.cancelRequest).mockRejectedValueOnce(
      new Error("Cancel error")
    );
    const { result } = renderHook(() => useSentRequests());
    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });
    act(() => {
      result.current.handleCancelClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleCancel();
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error canceling request:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not cancel when requestToCancel is null", async () => {
    // Arrange
    const { result } = renderHook(() => useSentRequests());
    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleCancel();
    });

    // Assert
    expect(friendRequestService.cancelRequest).not.toHaveBeenCalled();
  });

  it("does not load sent requests when user is null", async () => {
    // Arrange
    vi.mocked(authService.getUser).mockReturnValueOnce(null);

    // Act
    const { result } = renderHook(() => useSentRequests());

    // Assert
    await waitFor(() => {
      expect(result.current.sentRequests).toEqual([]);
    });
    expect(friendRequestService.getSentRequests).not.toHaveBeenCalled();
  });
});

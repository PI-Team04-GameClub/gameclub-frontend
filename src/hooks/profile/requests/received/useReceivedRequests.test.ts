import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReceivedRequests } from "./useReceivedRequests";
import { friendRequestService } from "../../../../services/friend_request_service";
import { authService } from "../../../../services/auth_service";

vi.mock("../../../../services/friend_request_service", () => ({
  friendRequestService: {
    getReceivedRequests: vi.fn(),
    acceptRequest: vi.fn(),
    rejectRequest: vi.fn(),
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

describe("useReceivedRequests", () => {
  const mockReceivedRequests = [
    {
      id: 1,
      senderId: 2,
      receiverId: 1,
      senderFirstName: "John",
      senderLastName: "Doe",
      senderEmail: "john@example.com",
      receiverFirstName: "Current",
      receiverLastName: "User",
      receiverEmail: "current@example.com",
      status: "pending" as const,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      senderId: 3,
      receiverId: 1,
      senderFirstName: "Jane",
      senderLastName: "Smith",
      senderEmail: "jane@example.com",
      receiverFirstName: "Current",
      receiverLastName: "User",
      receiverEmail: "current@example.com",
      status: "pending" as const,
      createdAt: "2024-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(friendRequestService.getReceivedRequests).mockResolvedValue(
      mockReceivedRequests
    );
  });

  it("loads received requests on mount", async () => {
    // Act
    const { result } = renderHook(() => useReceivedRequests());

    // Assert
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });
    expect(friendRequestService.getReceivedRequests).toHaveBeenCalledWith(1);
  });

  it("handles accept action", async () => {
    // Arrange
    vi.mocked(friendRequestService.acceptRequest).mockResolvedValue(undefined);
    const { result } = renderHook(() => useReceivedRequests());
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleAccept(1);
    });

    // Assert
    expect(friendRequestService.acceptRequest).toHaveBeenCalledWith(1);
    expect(friendRequestService.getReceivedRequests).toHaveBeenCalledTimes(2);
  });

  it("handles reject action", async () => {
    // Arrange
    vi.mocked(friendRequestService.rejectRequest).mockResolvedValue(undefined);
    const { result } = renderHook(() => useReceivedRequests());
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleReject(1);
    });

    // Assert
    expect(friendRequestService.rejectRequest).toHaveBeenCalledWith(1);
    expect(friendRequestService.getReceivedRequests).toHaveBeenCalledTimes(2);
  });

  it("handles error when loading received requests", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(friendRequestService.getReceivedRequests).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const { result } = renderHook(() => useReceivedRequests());

    // Assert
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading received requests:",
        expect.any(Error)
      );
    });
    expect(result.current.receivedRequests).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when accepting request", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(friendRequestService.acceptRequest).mockRejectedValueOnce(
      new Error("Accept error")
    );
    const { result } = renderHook(() => useReceivedRequests());
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleAccept(1);
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error accepting request:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("handles error when rejecting request", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(friendRequestService.rejectRequest).mockRejectedValueOnce(
      new Error("Reject error")
    );
    const { result } = renderHook(() => useReceivedRequests());
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleReject(1);
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error rejecting request:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not load received requests when user is null", async () => {
    // Arrange
    vi.mocked(authService.getUser).mockReturnValueOnce(null);

    // Act
    const { result } = renderHook(() => useReceivedRequests());

    // Assert
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual([]);
    });
    expect(friendRequestService.getReceivedRequests).not.toHaveBeenCalled();
  });
});

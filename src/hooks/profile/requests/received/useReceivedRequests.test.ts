import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReceivedRequests } from "./useReceivedRequests";
import { profileService } from "../../../../services/profile_service";

vi.mock("../../../../services/profile_service", () => ({
  profileService: {
    getReceivedRequests: vi.fn(),
    acceptRequest: vi.fn(),
    rejectRequest: vi.fn(),
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
    vi.mocked(profileService.getReceivedRequests).mockResolvedValue(
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
    expect(profileService.getReceivedRequests).toHaveBeenCalled();
  });

  it("handles accept action", async () => {
    // Arrange
    vi.mocked(profileService.acceptRequest).mockResolvedValue(undefined);
    const { result } = renderHook(() => useReceivedRequests());
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleAccept(1);
    });

    // Assert
    expect(profileService.acceptRequest).toHaveBeenCalledWith(1);
    expect(profileService.getReceivedRequests).toHaveBeenCalledTimes(2);
  });

  it("handles reject action", async () => {
    // Arrange
    vi.mocked(profileService.rejectRequest).mockResolvedValue(undefined);
    const { result } = renderHook(() => useReceivedRequests());
    await waitFor(() => {
      expect(result.current.receivedRequests).toEqual(mockReceivedRequests);
    });

    // Act
    await act(async () => {
      await result.current.handleReject(1);
    });

    // Assert
    expect(profileService.rejectRequest).toHaveBeenCalledWith(1);
    expect(profileService.getReceivedRequests).toHaveBeenCalledTimes(2);
  });

  it("handles error when loading received requests", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(profileService.getReceivedRequests).mockRejectedValueOnce(
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
    vi.mocked(profileService.acceptRequest).mockRejectedValueOnce(
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
    vi.mocked(profileService.rejectRequest).mockRejectedValueOnce(
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
});

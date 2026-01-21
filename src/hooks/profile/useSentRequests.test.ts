import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSentRequests } from "./useSentRequests";
import { profileService } from "../../services/profile_service";

vi.mock("../../services/profile_service", () => ({
  profileService: {
    getSentRequests: vi.fn(),
    cancelRequest: vi.fn(),
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
    vi.mocked(profileService.getSentRequests).mockResolvedValue(mockSentRequests);
  });

  it("loads sent requests on mount", async () => {
    const { result } = renderHook(() => useSentRequests());

    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    expect(profileService.getSentRequests).toHaveBeenCalled();
  });

  it("handles cancel click", async () => {
    const { result } = renderHook(() => useSentRequests());

    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    act(() => {
      result.current.handleCancelClick(1);
    });

    expect(result.current.isCancelDialogOpen).toBeDefined();
  });

  it("handles cancel action", async () => {
    vi.mocked(profileService.cancelRequest).mockResolvedValue(undefined);

    const { result } = renderHook(() => useSentRequests());

    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    act(() => {
      result.current.handleCancelClick(1);
    });

    await act(async () => {
      await result.current.handleCancel();
    });

    expect(profileService.cancelRequest).toHaveBeenCalledWith(1);
    expect(profileService.getSentRequests).toHaveBeenCalledTimes(2);
  });

  it("handles error when loading sent requests", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(profileService.getSentRequests).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSentRequests());

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith("Error loading sent requests:", expect.any(Error));
    });

    expect(result.current.sentRequests).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when canceling request", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(profileService.cancelRequest).mockRejectedValueOnce(new Error("Cancel error"));

    const { result } = renderHook(() => useSentRequests());

    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    act(() => {
      result.current.handleCancelClick(1);
    });

    await act(async () => {
      await result.current.handleCancel();
    });

    expect(consoleError).toHaveBeenCalledWith("Error canceling request:", expect.any(Error));
    consoleError.mockRestore();
  });

  it("does not cancel when requestToCancel is null", async () => {
    const { result } = renderHook(() => useSentRequests());

    await waitFor(() => {
      expect(result.current.sentRequests).toEqual(mockSentRequests);
    });

    await act(async () => {
      await result.current.handleCancel();
    });

    expect(profileService.cancelRequest).not.toHaveBeenCalled();
  });
});

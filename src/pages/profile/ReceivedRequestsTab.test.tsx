import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import ReceivedRequestsTab from "./ReceivedRequestsTab";
import { useReceivedRequests } from "../../hooks";

vi.mock("../../hooks", () => ({
  useReceivedRequests: vi.fn(),
}));

describe("ReceivedRequestsTab", () => {
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

  const mockUseReceivedRequests = {
    receivedRequests: mockReceivedRequests,
    handleAccept: vi.fn(),
    handleReject: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useReceivedRequests).mockReturnValue(mockUseReceivedRequests);
  });

  it("renders received requests list", () => {
    render(<ReceivedRequestsTab />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders sender emails", () => {
    render(<ReceivedRequestsTab />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders accept buttons", () => {
    render(<ReceivedRequestsTab />);

    const acceptButtons = screen.getAllByRole("button", { name: "Accept" });
    expect(acceptButtons).toHaveLength(2);
  });

  it("renders reject buttons", () => {
    render(<ReceivedRequestsTab />);

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    expect(rejectButtons).toHaveLength(2);
  });

  it("calls handleAccept when accept button clicked", async () => {
    const user = userEvent.setup();
    const handleAccept = vi.fn();
    vi.mocked(useReceivedRequests).mockReturnValue({
      ...mockUseReceivedRequests,
      handleAccept,
    });

    render(<ReceivedRequestsTab />);

    const acceptButtons = screen.getAllByRole("button", { name: "Accept" });
    await user.click(acceptButtons[0]);

    expect(handleAccept).toHaveBeenCalledWith(1);
  });

  it("calls handleReject when reject button clicked", async () => {
    const user = userEvent.setup();
    const handleReject = vi.fn();
    vi.mocked(useReceivedRequests).mockReturnValue({
      ...mockUseReceivedRequests,
      handleReject,
    });

    render(<ReceivedRequestsTab />);

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    await user.click(rejectButtons[0]);

    expect(handleReject).toHaveBeenCalledWith(1);
  });

  it("renders empty state when no received requests", () => {
    vi.mocked(useReceivedRequests).mockReturnValue({
      ...mockUseReceivedRequests,
      receivedRequests: [],
    });

    render(<ReceivedRequestsTab />);

    expect(
      screen.getByText("You don't have any pending friend requests.")
    ).toBeInTheDocument();
  });

  it("renders sender avatars", () => {
    render(<ReceivedRequestsTab />);

    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBeGreaterThanOrEqual(2);
  });

  it("handles multiple accept clicks on different requests", async () => {
    const user = userEvent.setup();
    const handleAccept = vi.fn();
    vi.mocked(useReceivedRequests).mockReturnValue({
      ...mockUseReceivedRequests,
      handleAccept,
    });

    render(<ReceivedRequestsTab />);

    const acceptButtons = screen.getAllByRole("button", { name: "Accept" });
    await user.click(acceptButtons[0]);
    await user.click(acceptButtons[1]);

    expect(handleAccept).toHaveBeenCalledTimes(2);
    expect(handleAccept).toHaveBeenNthCalledWith(1, 1);
    expect(handleAccept).toHaveBeenNthCalledWith(2, 2);
  });

  it("handles multiple reject clicks on different requests", async () => {
    const user = userEvent.setup();
    const handleReject = vi.fn();
    vi.mocked(useReceivedRequests).mockReturnValue({
      ...mockUseReceivedRequests,
      handleReject,
    });

    render(<ReceivedRequestsTab />);

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    await user.click(rejectButtons[0]);
    await user.click(rejectButtons[1]);

    expect(handleReject).toHaveBeenCalledTimes(2);
    expect(handleReject).toHaveBeenNthCalledWith(1, 1);
    expect(handleReject).toHaveBeenNthCalledWith(2, 2);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import SentRequestsTab from "./SentRequestsTab";
import { useSentRequests } from "../../../../hooks";

vi.mock("../../../../hooks", () => ({
  useSentRequests: vi.fn(),
}));

describe("SentRequestsTab", () => {
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

  const mockUseSentRequests = {
    sentRequests: mockSentRequests,
    isCancelDialogOpen: false,
    onCancelDialogClose: vi.fn(),
    handleCancelClick: vi.fn(),
    handleCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSentRequests).mockReturnValue(mockUseSentRequests);
  });

  it("renders sent requests list", () => {
    // Arrange & Act
    render(<SentRequestsTab />);

    // Assert
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders receiver emails", () => {
    // Arrange & Act
    render(<SentRequestsTab />);

    // Assert
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders pending badges", () => {
    // Arrange & Act
    render(<SentRequestsTab />);

    // Assert
    const pendingBadges = screen.getAllByText("Pending");
    expect(pendingBadges).toHaveLength(2);
  });

  it("renders cancel buttons", () => {
    // Arrange & Act
    render(<SentRequestsTab />);

    // Assert
    const cancelButtons = screen.getAllByRole("button", { name: "Cancel" });
    expect(cancelButtons).toHaveLength(2);
  });

  it("calls handleCancelClick when cancel button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleCancelClick = vi.fn();
    vi.mocked(useSentRequests).mockReturnValue({
      ...mockUseSentRequests,
      handleCancelClick,
    });
    render(<SentRequestsTab />);

    // Act
    const cancelButtons = screen.getAllByRole("button", { name: "Cancel" });
    await user.click(cancelButtons[0]);

    // Assert
    expect(handleCancelClick).toHaveBeenCalledWith(1);
  });

  it("renders empty state when no sent requests", () => {
    // Arrange
    vi.mocked(useSentRequests).mockReturnValue({
      ...mockUseSentRequests,
      sentRequests: [],
    });

    // Act
    render(<SentRequestsTab />);

    // Assert
    expect(
      screen.getByText("You haven't sent any friend requests.")
    ).toBeInTheDocument();
  });

  it("renders cancel confirmation dialog when open", () => {
    // Arrange
    vi.mocked(useSentRequests).mockReturnValue({
      ...mockUseSentRequests,
      isCancelDialogOpen: true,
    });

    // Act
    render(<SentRequestsTab />);

    // Assert
    expect(screen.getByText("Cancel Friend Request")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to cancel this friend request?")
    ).toBeInTheDocument();
  });

  it("calls handleCancel when dialog confirm clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    vi.mocked(useSentRequests).mockReturnValue({
      ...mockUseSentRequests,
      isCancelDialogOpen: true,
      handleCancel,
    });
    render(<SentRequestsTab />);

    // Act
    await user.click(screen.getByRole("button", { name: "Delete" }));

    // Assert
    await waitFor(() => {
      expect(handleCancel).toHaveBeenCalled();
    });
  });

  it("calls onCancelDialogClose when dialog cancel clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancelDialogClose = vi.fn();
    vi.mocked(useSentRequests).mockReturnValue({
      ...mockUseSentRequests,
      isCancelDialogOpen: true,
      onCancelDialogClose,
    });
    render(<SentRequestsTab />);

    // Act
    const cancelButtons = screen.getAllByRole("button", { name: "Cancel" });
    await user.click(cancelButtons[cancelButtons.length - 1]);

    // Assert
    expect(onCancelDialogClose).toHaveBeenCalled();
  });

  it("renders receiver avatars", () => {
    // Arrange & Act
    render(<SentRequestsTab />);

    // Assert
    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBeGreaterThanOrEqual(2);
  });
});

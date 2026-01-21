import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import FriendsTab from "./FriendsTab";
import { useFriends } from "../../hooks";

vi.mock("../../hooks", () => ({
  useFriends: vi.fn(),
}));

describe("FriendsTab", () => {
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

  const mockUseFriends = {
    friends: mockFriends,
    isDeleteDialogOpen: false,
    onDeleteDialogClose: vi.fn(),
    handleRemoveClick: vi.fn(),
    handleRemove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFriends).mockReturnValue(mockUseFriends);
  });

  it("renders friends list", () => {
    render(<FriendsTab />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders friend emails", () => {
    render(<FriendsTab />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders remove friend buttons", () => {
    render(<FriendsTab />);

    const removeButtons = screen.getAllByRole("button", { name: "Remove Friend" });
    expect(removeButtons).toHaveLength(2);
  });

  it("calls handleRemoveClick when remove button clicked", async () => {
    const user = userEvent.setup();
    const handleRemoveClick = vi.fn();
    vi.mocked(useFriends).mockReturnValue({
      ...mockUseFriends,
      handleRemoveClick,
    });

    render(<FriendsTab />);

    const removeButtons = screen.getAllByRole("button", { name: "Remove Friend" });
    await user.click(removeButtons[0]);

    expect(handleRemoveClick).toHaveBeenCalledWith(1);
  });

  it("renders empty state when no friends", () => {
    vi.mocked(useFriends).mockReturnValue({
      ...mockUseFriends,
      friends: [],
    });

    render(<FriendsTab />);

    expect(screen.getByText("You don't have any friends yet.")).toBeInTheDocument();
  });

  it("renders delete confirmation dialog when open", () => {
    vi.mocked(useFriends).mockReturnValue({
      ...mockUseFriends,
      isDeleteDialogOpen: true,
    });

    render(<FriendsTab />);

    expect(
      screen.getByText("Are you sure you want to remove this friend? This action cannot be undone."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls handleRemove when dialog confirm clicked", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    vi.mocked(useFriends).mockReturnValue({
      ...mockUseFriends,
      isDeleteDialogOpen: true,
      handleRemove,
    });

    render(<FriendsTab />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(handleRemove).toHaveBeenCalled();
    });
  });

  it("calls onDeleteDialogClose when dialog cancel clicked", async () => {
    const user = userEvent.setup();
    const onDeleteDialogClose = vi.fn();
    vi.mocked(useFriends).mockReturnValue({
      ...mockUseFriends,
      isDeleteDialogOpen: true,
      onDeleteDialogClose,
    });

    render(<FriendsTab />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onDeleteDialogClose).toHaveBeenCalled();
  });

  it("renders friend avatars", () => {
    render(<FriendsTab />);

    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBeGreaterThanOrEqual(2);
  });
});

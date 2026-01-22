import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import ProfilePage from "./ProfilePage";

const mockUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
};

vi.mock("../../context", async () => {
  const actual = await vi.importActual("../../context");
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: mockUser,
      isAuthenticated: true,
    })),
  };
});

vi.mock("../../hooks", () => ({
  useFriends: vi.fn(() => ({
    friends: [],
    isDeleteDialogOpen: false,
    onDeleteDialogClose: vi.fn(),
    handleRemoveClick: vi.fn(),
    handleRemove: vi.fn(),
  })),
  useSentRequests: vi.fn(() => ({
    sentRequests: [],
    isCancelDialogOpen: false,
    onCancelDialogClose: vi.fn(),
    handleCancelClick: vi.fn(),
    handleCancel: vi.fn(),
  })),
  useReceivedRequests: vi.fn(() => ({
    receivedRequests: [],
    handleAccept: vi.fn(),
    handleReject: vi.fn(),
  })),
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user name", () => {
    render(<ProfilePage />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders user email", () => {
    render(<ProfilePage />);
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders edit profile button", () => {
    render(<ProfilePage />);
    expect(
      screen.getByRole("button", { name: "Edit Profile" })
    ).toBeInTheDocument();
  });

  it("renders total wins stat", () => {
    render(<ProfilePage />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Total Wins")).toBeInTheDocument();
  });

  it("renders tabs", () => {
    render(<ProfilePage />);
    expect(screen.getByRole("tab", { name: "Friends" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Sent Requests" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Received Requests" })
    ).toBeInTheDocument();
  });

  it("friends tab is selected by default", () => {
    render(<ProfilePage />);
    expect(screen.getByRole("tab", { name: "Friends" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches to sent requests tab when clicked", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await user.click(screen.getByRole("tab", { name: "Sent Requests" }));

    expect(screen.getByRole("tab", { name: "Sent Requests" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches to received requests tab when clicked", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await user.click(screen.getByRole("tab", { name: "Received Requests" }));

    expect(
      screen.getByRole("tab", { name: "Received Requests" })
    ).toHaveAttribute("aria-selected", "true");
  });

  it("opens edit profile modal when edit button clicked", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await user.click(screen.getByRole("button", { name: "Edit Profile" }));

    expect(screen.getByPlaceholderText("Enter first name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter last name")).toBeInTheDocument();
  });

  it("renders avatar", () => {
    render(<ProfilePage />);
    const avatar = screen.getByRole("img", { name: "John Doe" });
    expect(avatar).toBeInTheDocument();
  });
});

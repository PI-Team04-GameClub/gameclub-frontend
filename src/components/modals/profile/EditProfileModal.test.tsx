import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { EditProfileModal } from "./EditProfileModal";

const mockUser = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
};

vi.mock("../../../context", async () => {
  const actual = await vi.importActual("../../../context");
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: mockUser,
      isAuthenticated: true,
    })),
  };
});

describe("EditProfileModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(<EditProfileModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<EditProfileModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
  });

  it("renders form fields", () => {
    render(<EditProfileModal {...defaultProps} />);
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("populates form with user data", () => {
    render(<EditProfileModal {...defaultProps} />);

    expect(screen.getByPlaceholderText("Enter first name")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Enter last name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Enter email")).toHaveValue("john@example.com");
  });

  it("renders cancel button", () => {
    render(<EditProfileModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders save changes button", () => {
    render(<EditProfileModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });

  it("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<EditProfileModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("allows typing in first name field", async () => {
    const user = userEvent.setup();
    render(<EditProfileModal {...defaultProps} />);

    const firstNameInput = screen.getByPlaceholderText("Enter first name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");
    expect(firstNameInput).toHaveValue("Jane");
  });

  it("allows typing in last name field", async () => {
    const user = userEvent.setup();
    render(<EditProfileModal {...defaultProps} />);

    const lastNameInput = screen.getByPlaceholderText("Enter last name");
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Smith");
    expect(lastNameInput).toHaveValue("Smith");
  });

  it("allows typing in email field", async () => {
    const user = userEvent.setup();
    render(<EditProfileModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("Enter email");
    await user.clear(emailInput);
    await user.type(emailInput, "jane@example.com");
    expect(emailInput).toHaveValue("jane@example.com");
  });

  it("disables save button when first name is empty", async () => {
    const user = userEvent.setup();
    render(<EditProfileModal {...defaultProps} />);

    const firstNameInput = screen.getByPlaceholderText("Enter first name");
    await user.clear(firstNameInput);

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });

  it("disables save button when last name is empty", async () => {
    const user = userEvent.setup();
    render(<EditProfileModal {...defaultProps} />);

    const lastNameInput = screen.getByPlaceholderText("Enter last name");
    await user.clear(lastNameInput);

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });

  it("disables save button when email is empty", async () => {
    const user = userEvent.setup();
    render(<EditProfileModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("Enter email");
    await user.clear(emailInput);

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });

  it("calls onClose when save button clicked with valid data", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<EditProfileModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});

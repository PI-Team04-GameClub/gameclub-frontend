import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { TeamModal } from "./TeamModal";

describe("TeamModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create modal when no team provided", () => {
    render(<TeamModal {...defaultProps} />);
    expect(screen.getByText("Create Team")).toBeInTheDocument();
  });

  it("renders update modal when team provided", () => {
    const team = { id: 1, name: "Team Alpha" };
    render(<TeamModal {...defaultProps} team={team} />);
    expect(screen.getByText("Update Team")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    render(<TeamModal {...defaultProps} />);
    expect(screen.getByText("Team Name *")).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(<TeamModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders create button when no team", () => {
    render(<TeamModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders update button when team provided", () => {
    const team = { id: 1, name: "Team Alpha" };
    render(<TeamModal {...defaultProps} team={team} />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TeamModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("populates form with team data when team provided", () => {
    const team = { id: 1, name: "Team Alpha" };
    render(<TeamModal {...defaultProps} team={team} />);

    expect(screen.getByPlaceholderText("Enter team name")).toHaveValue(
      "Team Alpha"
    );
  });

  it("allows typing in name field", async () => {
    const user = userEvent.setup();
    render(<TeamModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("Enter team name");
    await user.type(nameInput, "New Team");
    expect(nameInput).toHaveValue("New Team");
  });

  it("calls onSubmit and onClose when form submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <TeamModal {...defaultProps} onSubmit={onSubmit} onClose={onClose} />
    );

    await user.type(
      screen.getByPlaceholderText("Enter team name"),
      "Test Team"
    );
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Test Team" });
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    render(<TeamModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Create Team")).not.toBeInTheDocument();
  });

  it("clears form when no team and modal reopens", async () => {
    const { rerender } = render(<TeamModal {...defaultProps} isOpen={false} />);
    rerender(<TeamModal {...defaultProps} isOpen={true} />);

    expect(screen.getByPlaceholderText("Enter team name")).toHaveValue("");
  });
});

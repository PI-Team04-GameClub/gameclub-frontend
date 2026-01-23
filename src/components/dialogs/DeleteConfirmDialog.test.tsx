import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

describe("DeleteConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Delete Item",
    message: "Are you sure you want to delete this item?",
  };

  it("renders dialog when open", () => {
    // Arrange & Act
    render(<DeleteConfirmDialog {...defaultProps} />);

    // Assert
    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    // Arrange & Act
    render(<DeleteConfirmDialog {...defaultProps} isOpen={false} />);

    // Assert
    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
  });

  it("renders cancel button", () => {
    // Arrange & Act
    render(<DeleteConfirmDialog {...defaultProps} />);

    // Assert
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders delete button", () => {
    // Arrange & Act
    render(<DeleteConfirmDialog {...defaultProps} />);

    // Assert
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DeleteConfirmDialog {...defaultProps} onClose={onClose} />);

    // Act
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Assert
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm and onClose when delete button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <DeleteConfirmDialog
        {...defaultProps}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );

    // Act
    await user.click(screen.getByRole("button", { name: "Delete" }));

    // Assert
    expect(onConfirm).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("renders custom title", () => {
    // Arrange & Act
    render(<DeleteConfirmDialog {...defaultProps} title="Custom Title" />);

    // Assert
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    // Arrange & Act
    render(
      <DeleteConfirmDialog {...defaultProps} message="Custom message here" />
    );

    // Assert
    expect(screen.getByText("Custom message here")).toBeInTheDocument();
  });

  it("renders close button", () => {
    // Arrange & Act
    render(<DeleteConfirmDialog {...defaultProps} />);

    // Assert
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});

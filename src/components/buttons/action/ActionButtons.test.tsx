import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import ActionButtons from "./ActionButtons";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("ActionButtons", () => {
  it("renders nothing when no handlers provided", () => {
    // Act
    const { container } = renderWithChakra(<ActionButtons />);

    // Assert
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders edit button when onEdit is provided", () => {
    // Arrange
    const onEdit = vi.fn();

    // Act
    renderWithChakra(<ActionButtons onEdit={onEdit} />);

    // Assert
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders delete button when onDelete is provided", () => {
    // Arrange
    const onDelete = vi.fn();

    // Act
    renderWithChakra(<ActionButtons onDelete={onDelete} />);

    // Assert
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders both buttons when both handlers provided", () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Act
    renderWithChakra(<ActionButtons onEdit={onEdit} onDelete={onDelete} />);

    // Assert
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    // Arrange
    const onEdit = vi.fn();
    renderWithChakra(<ActionButtons onEdit={onEdit} />);

    // Act
    fireEvent.click(screen.getByText("Edit"));

    // Assert
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", () => {
    // Arrange
    const onDelete = vi.fn();
    renderWithChakra(<ActionButtons onDelete={onDelete} />);

    // Act
    fireEvent.click(screen.getByText("Delete"));

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("renders custom edit label", () => {
    // Arrange
    const onEdit = vi.fn();

    // Act
    renderWithChakra(<ActionButtons onEdit={onEdit} editLabel="Modify" />);

    // Assert
    expect(screen.getByText("Modify")).toBeInTheDocument();
  });

  it("renders custom delete label", () => {
    // Arrange
    const onDelete = vi.fn();

    // Act
    renderWithChakra(
      <ActionButtons onDelete={onDelete} deleteLabel="Remove" />
    );

    // Assert
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("applies custom size", () => {
    // Arrange
    const onEdit = vi.fn();

    // Act
    renderWithChakra(<ActionButtons onEdit={onEdit} size="lg" />);

    // Assert
    const button = screen.getByText("Edit");
    expect(button).toBeInTheDocument();
  });
});

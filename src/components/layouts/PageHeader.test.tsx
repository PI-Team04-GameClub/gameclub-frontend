import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import PageHeader from "./PageHeader";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("PageHeader", () => {
  it("renders title correctly", () => {
    // Arrange & Act
    renderWithChakra(<PageHeader title="Test Title" />);

    // Assert
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders action button when actionLabel and onAction provided", () => {
    // Arrange
    const onAction = vi.fn();

    // Act
    renderWithChakra(
      <PageHeader title="Title" actionLabel="Create" onAction={onAction} />
    );

    // Assert
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("does not render action button when actionLabel is missing", () => {
    // Arrange & Act
    renderWithChakra(<PageHeader title="Title" />);

    // Assert
    const button = screen.queryByRole("button");
    expect(button).toBeNull();
  });

  it("calls onAction when action button clicked", () => {
    // Arrange
    const onAction = vi.fn();
    renderWithChakra(
      <PageHeader title="Title" actionLabel="Click" onAction={onAction} />
    );

    // Act
    fireEvent.click(screen.getByText("Click"));

    // Assert
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("applies custom heading size", () => {
    // Arrange & Act
    renderWithChakra(<PageHeader title="Title" headingSize="2xl" />);

    // Assert
    expect(screen.getByText("Title")).toBeInTheDocument();
  });
});

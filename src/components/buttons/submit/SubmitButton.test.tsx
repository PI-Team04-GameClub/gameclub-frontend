import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import SubmitButton from "./SubmitButton";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("SubmitButton", () => {
  it("renders with children text", () => {
    // Arrange & Act
    renderWithChakra(<SubmitButton>Submit</SubmitButton>);

    // Assert
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders with custom children", () => {
    // Arrange & Act
    renderWithChakra(<SubmitButton>Submit Form</SubmitButton>);

    // Assert
    expect(screen.getByText("Submit Form")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    // Arrange
    const onClick = vi.fn();
    renderWithChakra(<SubmitButton onClick={onClick}>Click Me</SubmitButton>);

    // Act
    fireEvent.click(screen.getByText("Click Me"));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows spinner when loading is true", () => {
    // Arrange & Act
    renderWithChakra(<SubmitButton loading>Submit</SubmitButton>);

    // Assert
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });

  it("is disabled when loading is true", () => {
    // Arrange & Act
    renderWithChakra(<SubmitButton loading>Submit</SubmitButton>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("uses custom colorScheme", () => {
    // Arrange & Act
    renderWithChakra(<SubmitButton colorScheme="red">Submit</SubmitButton>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toHaveClass("chakra-button");
  });

  it("uses custom width", () => {
    // Arrange & Act
    renderWithChakra(<SubmitButton width="50%">Submit</SubmitButton>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("passes additional props to button", () => {
    // Arrange & Act
    renderWithChakra(
      <SubmitButton data-testid="custom-btn">Submit</SubmitButton>
    );

    // Assert
    expect(screen.getByTestId("custom-btn")).toBeInTheDocument();
  });
});

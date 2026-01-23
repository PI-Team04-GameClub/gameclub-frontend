import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ErrorAlert from "./ErrorAlert";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("ErrorAlert", () => {
  it("renders when isOpen is true", () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <ErrorAlert
        isOpen={true}
        onClose={() => {}}
        message="Something went wrong"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it('renders default title "Error"', () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <ErrorAlert
        isOpen={true}
        onClose={() => {}}
        message="Error message"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <ErrorAlert
        isOpen={true}
        onClose={() => {}}
        message="Error message"
        title="Custom Error"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("Custom Error")).toBeInTheDocument();
  });

  it('renders default button text "OK"', () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <ErrorAlert
        isOpen={true}
        onClose={() => {}}
        message="Error message"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders custom button text", () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <ErrorAlert
        isOpen={true}
        onClose={() => {}}
        message="Error message"
        buttonText="Close"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("calls onClose when button is clicked", () => {
    // Arrange
    const onClose = vi.fn();
    const cancelRef = React.createRef<HTMLButtonElement>();
    renderWithChakra(
      <ErrorAlert
        isOpen={true}
        onClose={onClose}
        message="Error message"
        cancelRef={cancelRef}
      />
    );

    // Act
    fireEvent.click(screen.getByText("OK"));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import SuccessAlert from "./SuccessAlert";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("SuccessAlert", () => {
  it("renders when isOpen is true", () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <SuccessAlert
        isOpen={true}
        onClose={() => {}}
        title="Success!"
        message="Operation completed successfully"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(
      screen.getByText("Operation completed successfully")
    ).toBeInTheDocument();
  });

  it("renders title", () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <SuccessAlert
        isOpen={true}
        onClose={() => {}}
        title="Great Success"
        message="Done"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("Great Success")).toBeInTheDocument();
  });

  it('renders default button text "OK"', () => {
    // Arrange
    const cancelRef = React.createRef<HTMLButtonElement>();

    // Act
    renderWithChakra(
      <SuccessAlert
        isOpen={true}
        onClose={() => {}}
        title="Success"
        message="Done"
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
      <SuccessAlert
        isOpen={true}
        onClose={() => {}}
        title="Success"
        message="Done"
        buttonText="Continue"
        cancelRef={cancelRef}
      />
    );

    // Assert
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("calls onClose when button is clicked", () => {
    // Arrange
    const onClose = vi.fn();
    const cancelRef = React.createRef<HTMLButtonElement>();
    renderWithChakra(
      <SuccessAlert
        isOpen={true}
        onClose={onClose}
        title="Success"
        message="Done"
        cancelRef={cancelRef}
      />
    );

    // Act
    fireEvent.click(screen.getByText("OK"));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

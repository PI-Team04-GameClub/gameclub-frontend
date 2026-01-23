import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import PasswordInput from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders with password type by default", () => {
    // Arrange & Act
    render(<PasswordInput data-testid="password-input" />);

    // Assert
    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("renders show button with default label", () => {
    // Arrange & Act
    render(<PasswordInput />);

    // Assert
    expect(screen.getByRole("button", { name: "Show" })).toBeInTheDocument();
  });

  it("toggles to text type when show button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PasswordInput data-testid="password-input" />);

    // Act
    await user.click(screen.getByRole("button", { name: "Show" }));

    // Assert
    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("shows hide button after clicking show", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PasswordInput />);

    // Act
    await user.click(screen.getByRole("button", { name: "Show" }));

    // Assert
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
  });

  it("toggles back to password type when hide is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PasswordInput data-testid="password-input" />);

    // Act
    await user.click(screen.getByRole("button", { name: "Show" }));
    await user.click(screen.getByRole("button", { name: "Hide" }));

    // Assert
    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("renders with custom show label", () => {
    // Arrange & Act
    render(<PasswordInput showLabel="Reveal" />);

    // Assert
    expect(screen.getByRole("button", { name: "Reveal" })).toBeInTheDocument();
  });

  it("renders with custom hide label", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<PasswordInput hideLabel="Conceal" />);

    // Act
    await user.click(screen.getByRole("button", { name: "Show" }));

    // Assert
    expect(screen.getByRole("button", { name: "Conceal" })).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    // Arrange & Act
    render(
      <PasswordInput
        placeholder="Enter password"
        data-testid="password-input"
      />
    );

    // Assert
    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "placeholder",
      "Enter password"
    );
  });

  it("handles onChange events", async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PasswordInput onChange={onChange} data-testid="password-input" />);

    // Act
    await user.type(screen.getByTestId("password-input"), "test");

    // Assert
    expect(onChange).toHaveBeenCalled();
  });

  it("renders with value prop", () => {
    // Arrange & Act
    render(
      <PasswordInput value="secret" data-testid="password-input" isReadOnly />
    );

    // Assert
    expect(screen.getByTestId("password-input")).toHaveValue("secret");
  });
});

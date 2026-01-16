import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import PasswordInput from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders with password type by default", () => {
    render(<PasswordInput data-testid="password-input" />);
    expect(screen.getByTestId("password-input")).toHaveAttribute("type", "password");
  });

  it("renders show button with default label", () => {
    render(<PasswordInput />);
    expect(screen.getByRole("button", { name: "Show" })).toBeInTheDocument();
  });

  it("toggles to text type when show button is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput data-testid="password-input" />);

    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByTestId("password-input")).toHaveAttribute("type", "text");
  });

  it("shows hide button after clicking show", async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);

    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
  });

  it("toggles back to password type when hide is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput data-testid="password-input" />);

    await user.click(screen.getByRole("button", { name: "Show" }));
    await user.click(screen.getByRole("button", { name: "Hide" }));
    expect(screen.getByTestId("password-input")).toHaveAttribute("type", "password");
  });

  it("renders with custom show label", () => {
    render(<PasswordInput showLabel="Reveal" />);
    expect(screen.getByRole("button", { name: "Reveal" })).toBeInTheDocument();
  });

  it("renders with custom hide label", async () => {
    const user = userEvent.setup();
    render(<PasswordInput hideLabel="Conceal" />);

    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByRole("button", { name: "Conceal" })).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    render(<PasswordInput placeholder="Enter password" data-testid="password-input" />);
    expect(screen.getByTestId("password-input")).toHaveAttribute(
      "placeholder",
      "Enter password",
    );
  });

  it("handles onChange events", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PasswordInput onChange={onChange} data-testid="password-input" />);

    await user.type(screen.getByTestId("password-input"), "test");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders with value prop", () => {
    render(<PasswordInput value="secret" data-testid="password-input" isReadOnly />);
    expect(screen.getByTestId("password-input")).toHaveValue("secret");
  });
});

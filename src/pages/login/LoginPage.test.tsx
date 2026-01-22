import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import * as contextModule from "../../context";

const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

const renderLoginPage = () => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      register: vi.fn(),
      isAuthenticated: false,
      user: null,
    });
  });

  it("renders login form", () => {
    renderLoginPage();
    expect(screen.getByText("GameClub")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders email input", () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("renders password input", () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    renderLoginPage();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("renders create account link", () => {
    renderLoginPage();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create account" })
    ).toBeInTheDocument();
  });

  it("allows typing in email input", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("Email");
    await user.type(emailInput, "test@test.com");
    expect(emailInput).toHaveValue("test@test.com");
  });

  it("allows typing in password input", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(passwordInput, "password123");
    expect(passwordInput).toHaveValue("password123");
  });

  it("shows toast when submitting empty form", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
      })
    );
  });

  it("calls login and navigates on successful login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/news");
    });
  });

  it("shows success toast on successful login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Login successful",
          status: "success",
        })
      );
    });
  });

  it("shows error dialog on failed login", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });

  it("handles login on Enter key press", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(
      screen.getByPlaceholderText("Password"),
      "password123{enter}"
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it("shows API error message when available", async () => {
    const user = userEvent.setup();
    const error = new Error("Network error") as Error & {
      response?: { data?: { error?: string } };
    };
    error.response = { data: { error: "Invalid email or password" } };
    mockLogin.mockRejectedValue(error);

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("closes error dialog when OK clicked", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "OK" }));

    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });
});

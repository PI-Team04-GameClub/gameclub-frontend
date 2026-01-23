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
    // Act
    renderLoginPage();

    // Assert
    expect(screen.getByText("GameClub")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders email input", () => {
    // Act
    renderLoginPage();

    // Assert
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("renders password input", () => {
    // Act
    renderLoginPage();

    // Assert
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    // Act
    renderLoginPage();

    // Assert
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("renders create account link", () => {
    // Act
    renderLoginPage();

    // Assert
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create account" })
    ).toBeInTheDocument();
  });

  it("allows typing in email input", async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginPage();

    // Act
    const emailInput = screen.getByPlaceholderText("Email");
    await user.type(emailInput, "test@test.com");

    // Assert
    expect(emailInput).toHaveValue("test@test.com");
  });

  it("allows typing in password input", async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginPage();

    // Act
    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(passwordInput, "password123");

    // Assert
    expect(passwordInput).toHaveValue("password123");
  });

  it("shows toast when submitting empty form", async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginPage();

    // Act
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    // Assert
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
      })
    );
  });

  it("calls login and navigates on successful login", async () => {
    // Arrange
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderLoginPage();

    // Act
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    // Assert
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
    // Arrange
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderLoginPage();

    // Act
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    // Assert
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
    // Arrange
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));
    renderLoginPage();

    // Act
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });

  it("handles login on Enter key press", async () => {
    // Arrange
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderLoginPage();

    // Act
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(
      screen.getByPlaceholderText("Password"),
      "password123{enter}"
    );

    // Assert
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it("shows API error message when available", async () => {
    // Arrange
    const user = userEvent.setup();
    const error = new Error("Network error") as Error & {
      response?: { data?: { error?: string } };
    };
    error.response = { data: { error: "Invalid email or password" } };
    mockLogin.mockRejectedValue(error);
    renderLoginPage();

    // Act
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("closes error dialog when OK clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));
    renderLoginPage();
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    // Act
    await user.click(screen.getByRole("button", { name: "OK" }));

    // Assert
    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });
});

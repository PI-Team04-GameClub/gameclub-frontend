import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";
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

const renderRegisterPage = () => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe("RegisterPage", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      register: mockRegister,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      user: null,
    });
  });

  it("renders registration form", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(screen.getByText("GameClub")).toBeInTheDocument();
    expect(screen.getByText("Create a new account")).toBeInTheDocument();
  });

  it("renders first name input", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
  });

  it("renders last name input", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
  });

  it("renders email input", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("renders password input", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders create account button", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeInTheDocument();
  });

  it("renders sign in link", () => {
    // Arrange & Act
    renderRegisterPage();

    // Assert
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("allows typing in form inputs", async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");

    // Assert
    expect(screen.getByPlaceholderText("First Name")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("john@test.com");
    expect(screen.getByPlaceholderText("Password")).toHaveValue("password123");
  });

  it("shows toast when submitting with missing required fields", async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterPage();

    // Act
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
      })
    );
  });

  it("shows toast when password is too short", async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "12345");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Password must be at least 6 characters",
        status: "error",
      })
    );
  });

  it("calls register on successful form submission", async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: "John",
        last_name: "Doe",
        email: "john@test.com",
        password: "password123",
      });
    });
  });

  it("shows success dialog on successful registration", async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Registration Successful")).toBeInTheDocument();
    });
  });

  it("navigates to login on success dialog close", async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));
    await waitFor(() => {
      expect(screen.getByText("Registration Successful")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "OK" }));

    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error dialog on failed registration", async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockRejectedValue(new Error("Email already exists"));
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  it("handles register on Enter key press", async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
    });
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(
      screen.getByPlaceholderText("Password"),
      "password123{enter}"
    );

    // Assert
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it("shows API error message when available", async () => {
    // Arrange
    const user = userEvent.setup();
    const error = new Error("Network error") as Error & {
      response?: { data?: { error?: string } };
    };
    error.response = { data: { error: "Email already registered" } };
    mockRegister.mockRejectedValue(error);
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Email already registered")).toBeInTheDocument();
    });
  });

  it("registers with empty last name", async () => {
    // Arrange
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({
      token: "jwt-token",
      id: 1,
      email: "john@test.com",
      first_name: "John",
      last_name: "",
    });
    renderRegisterPage();

    // Act
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Email"), "john@test.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // Assert
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: "John",
        last_name: "",
        email: "john@test.com",
        password: "password123",
      });
    });
  });
});

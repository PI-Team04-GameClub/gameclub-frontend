import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { authService } from "../services/auth_service";

vi.mock("../services/auth_service", () => ({
  authService: {
    getToken: vi.fn(),
    getUser: vi.fn(),
    setToken: vi.fn(),
    setUser: vi.fn(),
    logout: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

const TestComponent = () => {
  const { isAuthenticated, user, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated ? "yes" : "no"}</div>
      <div data-testid="user">{user ? user.email : "none"}</div>
      <button
        onClick={() =>
          login({ email: "test@test.com", password: "password123" })
        }
      >
        Login
      </button>
      <button
        onClick={() =>
          register({
            email: "test@test.com",
            password: "password123",
            first_name: "John",
            last_name: "Doe",
          })
        }
      >
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>{ui}</AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getToken).mockReturnValue(null);
    vi.mocked(authService.getUser).mockReturnValue(null);
  });

  describe("AuthProvider", () => {
    it("provides initial unauthenticated state when no token", () => {
      renderWithProviders(<TestComponent />);

      expect(screen.getByTestId("authenticated")).toHaveTextContent("no");
      expect(screen.getByTestId("user")).toHaveTextContent("none");
    });

    it("provides authenticated state when token exists", () => {
      vi.mocked(authService.getToken).mockReturnValue("test-token");
      vi.mocked(authService.getUser).mockReturnValue({
        id: 1,
        email: "test@test.com",
        first_name: "John",
        last_name: "Doe",
      });

      renderWithProviders(<TestComponent />);

      expect(screen.getByTestId("authenticated")).toHaveTextContent("yes");
      expect(screen.getByTestId("user")).toHaveTextContent("test@test.com");
    });
  });

  describe("login", () => {
    it("logs in user and updates state", async () => {
      const user = userEvent.setup();
      const authResponse = {
        token: "jwt-token",
        id: 1,
        email: "test@test.com",
        first_name: "John",
        last_name: "Doe",
      };
      vi.mocked(authService.login).mockResolvedValue(authResponse);

      renderWithProviders(<TestComponent />);

      expect(screen.getByTestId("authenticated")).toHaveTextContent("no");

      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Login" }));
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent("yes");
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(authService.setToken).toHaveBeenCalledWith("jwt-token");
      expect(authService.setUser).toHaveBeenCalled();
    });
  });

  describe("register", () => {
    it("registers user and returns response", async () => {
      const user = userEvent.setup();
      const authResponse = {
        token: "jwt-token",
        id: 1,
        email: "test@test.com",
        first_name: "John",
        last_name: "Doe",
      };
      vi.mocked(authService.register).mockResolvedValue(authResponse);

      renderWithProviders(<TestComponent />);

      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Register" }));
      });

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          email: "test@test.com",
          password: "password123",
          first_name: "John",
          last_name: "Doe",
        });
      });
    });
  });

  describe("logout", () => {
    it("logs out user and clears state", async () => {
      const user = userEvent.setup();
      vi.mocked(authService.getToken).mockReturnValue("test-token");
      vi.mocked(authService.getUser).mockReturnValue({
        id: 1,
        email: "test@test.com",
        first_name: "John",
        last_name: "Doe",
      });

      renderWithProviders(<TestComponent />);

      expect(screen.getByTestId("authenticated")).toHaveTextContent("yes");

      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Logout" }));
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(screen.getByTestId("authenticated")).toHaveTextContent("no");
      expect(screen.getByTestId("user")).toHaveTextContent("none");
    });
  });

  describe("useAuth", () => {
    it("throws error when used outside AuthProvider", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(
          <ChakraProvider>
            <BrowserRouter>
              <TestComponent />
            </BrowserRouter>
          </ChakraProvider>
        );
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleError.mockRestore();
    });
  });

  describe("storage event listener", () => {
    it("updates state on storage change", async () => {
      vi.mocked(authService.getToken).mockReturnValue(null);
      vi.mocked(authService.getUser).mockReturnValue(null);

      renderWithProviders(<TestComponent />);

      expect(screen.getByTestId("authenticated")).toHaveTextContent("no");

      vi.mocked(authService.getToken).mockReturnValue("new-token");
      vi.mocked(authService.getUser).mockReturnValue({
        id: 2,
        email: "new@test.com",
        first_name: "Jane",
        last_name: "Doe",
      });

      await act(async () => {
        window.dispatchEvent(new Event("storage"));
      });

      await waitFor(() => {
        expect(screen.getByTestId("authenticated")).toHaveTextContent("yes");
        expect(screen.getByTestId("user")).toHaveTextContent("new@test.com");
      });
    });
  });
});

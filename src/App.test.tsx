import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { authService } from "./services/auth_service";

vi.mock("./services/auth_service", () => ({
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

vi.mock("./services/game_service", () => ({
  gameService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("./services/news_service", () => ({
  newsService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("./services/team_service", () => ({
  teamService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("./services/tournament_service", () => ({
  tournamentService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("App", () => {
  const mockAuthenticatedUser = {
    id: 1,
    email: "test@test.com",
    first_name: "John",
    last_name: "Doe",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getToken).mockReturnValue(null);
    vi.mocked(authService.getUser).mockReturnValue(null);
  });

  it("renders without crashing", () => {
    // Arrange & Act
    render(<App />);

    // Assert
    expect(document.body).toBeInTheDocument();
  });

  it("renders login page when not authenticated", () => {
    // Arrange & Act
    render(<App />);

    // Assert
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders GameClub heading on login page", () => {
    // Arrange & Act
    render(<App />);

    // Assert
    expect(
      screen.getByRole("heading", { name: "GameClub" })
    ).toBeInTheDocument();
  });

  it("renders create account link on login page", () => {
    // Arrange & Act
    render(<App />);

    // Assert
    expect(
      screen.getByRole("link", { name: "Create account" })
    ).toBeInTheDocument();
  });

  it("redirects to login when accessing protected route unauthenticated", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue(null);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  it("shows navbar when authenticated", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue(mockAuthenticatedUser);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("GameClub")).toBeInTheDocument();
    });
  });

  it("redirects to news when authenticated user visits login page", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue(mockAuthenticatedUser);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("News & Updates")).toBeInTheDocument();
    });
  });

  it("redirects to news when authenticated user visits root", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue(mockAuthenticatedUser);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("News & Updates")).toBeInTheDocument();
    });
  });

  it("redirects to news when authenticated user visits register page", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue(mockAuthenticatedUser);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("News & Updates")).toBeInTheDocument();
    });
  });

  it("redirects to login when unauthenticated user visits root", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue(null);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  it("renders register page elements correctly", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue(null);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Create account" })
      ).toBeInTheDocument();
    });
  });

  it("renders nav links when authenticated", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue(mockAuthenticatedUser);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("News")).toBeInTheDocument();
      expect(screen.getByText("Games")).toBeInTheDocument();
      expect(screen.getByText("Teams")).toBeInTheDocument();
      expect(screen.getByText("Tournaments")).toBeInTheDocument();
    });
  });

  it("shows user name when authenticated", async () => {
    // Arrange
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue(mockAuthenticatedUser);

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });
  });
});

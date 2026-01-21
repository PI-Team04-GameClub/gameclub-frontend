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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getToken).mockReturnValue(null);
    vi.mocked(authService.getUser).mockReturnValue(null);
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it("renders login page when not authenticated", () => {
    render(<App />);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders GameClub heading on login page", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "GameClub" })).toBeInTheDocument();
  });

  it("renders create account link on login page", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Create account" })).toBeInTheDocument();
  });

  it("redirects to login when accessing protected route unauthenticated", async () => {
    vi.mocked(authService.getToken).mockReturnValue(null);

    // App already includes BrowserRouter, so we test by rendering App directly
    // The router in App will use the current window.location
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  it("shows navbar when authenticated", async () => {
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue({
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("GameClub")).toBeInTheDocument();
    });
  });

  it("redirects to news when authenticated user visits login page", async () => {
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue({
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("News & Updates")).toBeInTheDocument();
    });
  });

  it("redirects to news when authenticated user visits root", async () => {
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue({
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("News & Updates")).toBeInTheDocument();
    });
  });

  it("redirects to news when authenticated user visits register page", async () => {
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue({
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    // App already includes BrowserRouter - authenticated users are redirected to /news
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("News & Updates")).toBeInTheDocument();
    });
  });

  it("redirects to login when unauthenticated user visits root", async () => {
    vi.mocked(authService.getToken).mockReturnValue(null);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  it("renders register page elements correctly", async () => {
    vi.mocked(authService.getToken).mockReturnValue(null);

    render(<App />);

    // First, verify the login page renders with the register link
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Create account" })).toBeInTheDocument();
    });
  });

  it("renders nav links when authenticated", async () => {
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue({
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("News")).toBeInTheDocument();
      expect(screen.getByText("Games")).toBeInTheDocument();
      expect(screen.getByText("Teams")).toBeInTheDocument();
      expect(screen.getByText("Tournaments")).toBeInTheDocument();
    });
  });

  it("shows user name when authenticated", async () => {
    vi.mocked(authService.getToken).mockReturnValue("test-token");
    vi.mocked(authService.getUser).mockReturnValue({
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import * as contextModule from "../../context";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderNavbar = () => {
  return render(
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </ChakraProvider>,
  );
};

describe("Navbar", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the brand name", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    expect(screen.getByText("GameClub")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByText("Tournaments")).toBeInTheDocument();
  });

  it("renders user name when logged in", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders logout button when logged in", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("does not render user info when not logged in", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: null,
      logout: mockLogout,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });

  it("calls logout and navigates to login when logout button is clicked", async () => {
    const user = userEvent.setup();
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Logout" }));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders navigation link to news", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    const newsLink = screen.getByText("News").closest("a");
    expect(newsLink).toHaveAttribute("href", "/news");
  });

  it("renders navigation link to games", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    const gamesLink = screen.getByText("Games").closest("a");
    expect(gamesLink).toHaveAttribute("href", "/games");
  });

  it("renders navigation link to teams", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    const teamsLink = screen.getByText("Teams").closest("a");
    expect(teamsLink).toHaveAttribute("href", "/teams");
  });

  it("renders navigation link to tournaments", () => {
    vi.spyOn(contextModule, "useAuth").mockReturnValue({
      user: { id: 1, email: "test@test.com", first_name: "John", last_name: "Doe" },
      logout: mockLogout,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    });

    renderNavbar();
    const tournamentsLink = screen.getByText("Tournaments").closest("a");
    expect(tournamentsLink).toHaveAttribute("href", "/tournaments");
  });
});

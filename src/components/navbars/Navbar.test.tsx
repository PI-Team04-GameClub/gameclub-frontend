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
    </ChakraProvider>
  );
};

describe("Navbar", () => {
  const mockLogout = vi.fn();

  const mockAuthenticatedUser = {
    user: {
      id: 1,
      email: "test@test.com",
      first_name: "John",
      last_name: "Doe",
    },
    logout: mockLogout,
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
  };

  const mockUnauthenticatedUser = {
    user: null,
    logout: mockLogout,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the brand name", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    expect(screen.getByText("GameClub")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByText("Tournaments")).toBeInTheDocument();
  });

  it("renders profile link when logged in", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders logout button when logged in", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("does not render user info when not logged in", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockUnauthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Logout" })
    ).not.toBeInTheDocument();
  });

  it("calls logout and navigates to login when logout button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);
    renderNavbar();

    // Act
    await user.click(screen.getByRole("button", { name: "Logout" }));

    // Assert
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders navigation link to news", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    const newsLink = screen.getByText("News").closest("a");
    expect(newsLink).toHaveAttribute("href", "/news");
  });

  it("renders navigation link to games", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    const gamesLink = screen.getByText("Games").closest("a");
    expect(gamesLink).toHaveAttribute("href", "/games");
  });

  it("renders navigation link to teams", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    const teamsLink = screen.getByText("Teams").closest("a");
    expect(teamsLink).toHaveAttribute("href", "/teams");
  });

  it("renders navigation link to tournaments", () => {
    // Arrange
    vi.spyOn(contextModule, "useAuth").mockReturnValue(mockAuthenticatedUser);

    // Act
    renderNavbar();

    // Assert
    const tournamentsLink = screen.getByText("Tournaments").closest("a");
    expect(tournamentsLink).toHaveAttribute("href", "/tournaments");
  });
});

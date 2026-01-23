import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import NavLink from "./NavLink";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>
  );
};

describe("NavLink", () => {
  it("renders link with correct text", () => {
    // Arrange & Act
    renderWithProviders(<NavLink to="/home">Home</NavLink>);

    // Assert
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders link with correct href", () => {
    // Arrange & Act
    renderWithProviders(<NavLink to="/games">Games</NavLink>);

    // Assert
    const link = screen.getByText("Games").closest("a");
    expect(link).toHaveAttribute("href", "/games");
  });

  it("renders multiple NavLinks correctly", () => {
    // Arrange & Act
    renderWithProviders(
      <>
        <NavLink to="/news">News</NavLink>
        <NavLink to="/teams">Teams</NavLink>
      </>
    );

    // Assert
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
  });
});

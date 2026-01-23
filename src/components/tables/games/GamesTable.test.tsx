import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import GamesTable from "./GamesTable";

describe("GamesTable", () => {
  const mockGames = [
    {
      id: 1,
      name: "Chess",
      description: "Strategy board game",
      numberOfPlayers: 2,
    },
    { id: 2, name: "Poker", description: "Card game", numberOfPlayers: 6 },
  ];

  const defaultProps = {
    games: mockGames,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("renders table headers", () => {
    // Act
    render(<GamesTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Players")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders game names", () => {
    // Act
    render(<GamesTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Chess")).toBeInTheDocument();
    expect(screen.getByText("Poker")).toBeInTheDocument();
  });

  it("renders game descriptions", () => {
    // Act
    render(<GamesTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Strategy board game")).toBeInTheDocument();
    expect(screen.getByText("Card game")).toBeInTheDocument();
  });

  it("renders player counts", () => {
    // Act
    render(<GamesTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders edit buttons for each game", () => {
    // Act
    render(<GamesTable {...defaultProps} />);

    // Assert
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete buttons for each game", () => {
    // Act
    render(<GamesTable {...defaultProps} />);

    // Assert
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls onEdit with correct game when edit button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<GamesTable {...defaultProps} onEdit={onEdit} />);

    // Act
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Assert
    expect(onEdit).toHaveBeenCalledWith(mockGames[0]);
  });

  it("calls onDelete with correct id when delete button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<GamesTable {...defaultProps} onDelete={onDelete} />);

    // Act
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("renders empty table when no games provided", () => {
    // Act
    render(<GamesTable {...defaultProps} games={[]} />);

    // Assert
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Chess")).not.toBeInTheDocument();
  });
});

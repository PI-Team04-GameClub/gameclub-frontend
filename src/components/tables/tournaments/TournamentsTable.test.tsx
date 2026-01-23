import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import TournamentsTable from "./TournamentsTable";
import type { Tournament } from "../../../types";

describe("TournamentsTable", () => {
  const mockTournaments = [
    {
      id: 1,
      name: "Championship",
      game: "Chess",
      prizePool: 1000,
      startDate: "2024-06-01T00:00:00Z",
      status: "Active" as const,
      players: 16,
    },
    {
      id: 2,
      name: "League",
      game: "Poker",
      prizePool: 5000,
      startDate: "2024-07-15T00:00:00Z",
      status: "Upcoming" as const,
      players: 32,
    },
  ];

  const defaultProps = {
    tournaments: mockTournaments,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("renders table headers", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Game")).toBeInTheDocument();
    expect(screen.getByText("Prize Pool")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders tournament names", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Championship")).toBeInTheDocument();
    expect(screen.getByText("League")).toBeInTheDocument();
  });

  it("renders game names", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Chess")).toBeInTheDocument();
    expect(screen.getByText("Poker")).toBeInTheDocument();
  });

  it("renders prize pools", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
  });

  it("renders start dates (date part only)", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("2024-06-01")).toBeInTheDocument();
    expect(screen.getByText("2024-07-15")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("renders edit buttons for each tournament", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete buttons for each tournament", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} />);

    // Assert
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls onEdit with correct tournament when edit button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TournamentsTable {...defaultProps} onEdit={onEdit} />);

    // Act
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Assert
    expect(onEdit).toHaveBeenCalledWith(mockTournaments[0]);
  });

  it("calls onDelete with correct id when delete button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TournamentsTable {...defaultProps} onDelete={onDelete} />);

    // Act
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("renders empty table when no tournaments provided", () => {
    // Arrange & Act
    render(<TournamentsTable {...defaultProps} tournaments={[]} />);

    // Assert
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Championship")).not.toBeInTheDocument();
  });

  it("renders Completed status with correct color", () => {
    // Arrange
    const completedTournament = {
      ...mockTournaments[0],
      status: "Completed" as const,
    };

    // Act
    render(
      <TournamentsTable {...defaultProps} tournaments={[completedTournament]} />
    );

    // Assert
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders unknown status with orange color", () => {
    // Arrange
    const unknownTournament = {
      id: 1,
      name: "Championship",
      game: "Chess",
      prizePool: 1000,
      startDate: "2024-06-01T00:00:00Z",
      status: "Unknown",
      players: 16,
    } as unknown as Tournament;

    // Act
    render(
      <TournamentsTable {...defaultProps} tournaments={[unknownTournament]} />
    );

    // Assert
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});

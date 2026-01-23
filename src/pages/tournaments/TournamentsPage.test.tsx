import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import TournamentsPage from "./TournamentsPage";
import { useTournaments } from "../../hooks";
import { gameService } from "../../services/game_service";

vi.mock("../../hooks", () => ({
  useTournaments: vi.fn(),
}));

vi.mock("../../services/game_service", () => ({
  gameService: {
    getAll: vi.fn(),
  },
}));

describe("TournamentsPage", () => {
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
      startDate: "2024-07-01T00:00:00Z",
      status: "Upcoming" as const,
      players: 32,
    },
  ];

  const mockHookReturn = {
    tournaments: mockTournaments,
    selectedTournament: undefined,
    isModalOpen: false,
    onModalClose: vi.fn(),
    isDeleteDialogOpen: false,
    onDeleteDialogClose: vi.fn(),
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleDeleteClick: vi.fn(),
    handleSubmit: vi.fn(),
    handleDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTournaments).mockReturnValue(mockHookReturn);
    vi.mocked(gameService.getAll).mockResolvedValue([]);
  });

  it("renders page header with title", () => {
    // Arrange & Act
    render(<TournamentsPage />);

    // Assert
    expect(screen.getByText("Tournaments")).toBeInTheDocument();
  });

  it("renders create tournament button", () => {
    // Arrange & Act
    render(<TournamentsPage />);

    // Assert
    expect(
      screen.getByRole("button", { name: /create tournament/i })
    ).toBeInTheDocument();
  });

  it("renders tournaments table", () => {
    // Arrange & Act
    render(<TournamentsPage />);

    // Assert
    expect(screen.getByText("Championship")).toBeInTheDocument();
    expect(screen.getByText("League")).toBeInTheDocument();
  });

  it("calls handleCreate when create button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    vi.mocked(useTournaments).mockReturnValue({
      ...mockHookReturn,
      handleCreate,
    });
    render(<TournamentsPage />);

    // Act
    await user.click(
      screen.getByRole("button", { name: /create tournament/i })
    );

    // Assert
    expect(handleCreate).toHaveBeenCalled();
  });

  it("renders modal when isModalOpen is true", () => {
    // Arrange
    vi.mocked(useTournaments).mockReturnValue({
      ...mockHookReturn,
      isModalOpen: true,
    });

    // Act
    render(<TournamentsPage />);

    // Assert
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Create Tournament")).toBeInTheDocument();
  });

  it("renders delete dialog when isDeleteDialogOpen is true", () => {
    // Arrange
    vi.mocked(useTournaments).mockReturnValue({
      ...mockHookReturn,
      isDeleteDialogOpen: true,
    });

    // Act
    render(<TournamentsPage />);

    // Assert
    expect(screen.getByText("Delete Tournament")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this tournament? This action cannot be undone."
      )
    ).toBeInTheDocument();
  });

  it("renders edit button for each tournament", () => {
    // Arrange & Act
    render(<TournamentsPage />);

    // Assert
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete button for each tournament", () => {
    // Arrange & Act
    render(<TournamentsPage />);

    // Assert
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls handleEdit when edit button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    vi.mocked(useTournaments).mockReturnValue({
      ...mockHookReturn,
      handleEdit,
    });
    render(<TournamentsPage />);

    // Act
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Assert
    expect(handleEdit).toHaveBeenCalledWith(mockTournaments[0]);
  });

  it("calls handleDeleteClick when delete button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleDeleteClick = vi.fn();
    vi.mocked(useTournaments).mockReturnValue({
      ...mockHookReturn,
      handleDeleteClick,
    });
    render(<TournamentsPage />);

    // Act
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    expect(handleDeleteClick).toHaveBeenCalledWith(1);
  });

  it("renders status badges", () => {
    // Arrange & Act
    render(<TournamentsPage />);

    // Assert
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });
});

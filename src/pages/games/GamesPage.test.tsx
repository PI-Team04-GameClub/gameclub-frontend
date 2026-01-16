import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import GamesPage from "./GamesPage";
import { useGames } from "../../hooks";

vi.mock("../../hooks", () => ({
  useGames: vi.fn(),
}));

describe("GamesPage", () => {
  const mockGames = [
    { id: 1, name: "Chess", description: "Strategy game", numberOfPlayers: 2 },
    { id: 2, name: "Poker", description: "Card game", numberOfPlayers: 6 },
  ];

  const mockHookReturn = {
    games: mockGames,
    selectedGame: undefined,
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
    vi.mocked(useGames).mockReturnValue(mockHookReturn);
  });

  it("renders page header with title", () => {
    render(<GamesPage />);
    expect(screen.getByText("Games")).toBeInTheDocument();
  });

  it("renders create game button", () => {
    render(<GamesPage />);
    expect(screen.getByRole("button", { name: /create game/i })).toBeInTheDocument();
  });

  it("renders games table", () => {
    render(<GamesPage />);
    expect(screen.getByText("Chess")).toBeInTheDocument();
    expect(screen.getByText("Poker")).toBeInTheDocument();
  });

  it("calls handleCreate when create button clicked", async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    vi.mocked(useGames).mockReturnValue({ ...mockHookReturn, handleCreate });

    render(<GamesPage />);
    await user.click(screen.getByRole("button", { name: /create game/i }));

    expect(handleCreate).toHaveBeenCalled();
  });

  it("renders modal when isModalOpen is true", () => {
    vi.mocked(useGames).mockReturnValue({ ...mockHookReturn, isModalOpen: true });

    render(<GamesPage />);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Create Game")).toBeInTheDocument();
  });

  it("renders delete dialog when isDeleteDialogOpen is true", () => {
    vi.mocked(useGames).mockReturnValue({
      ...mockHookReturn,
      isDeleteDialogOpen: true,
    });

    render(<GamesPage />);
    expect(screen.getByText("Delete Game")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this game? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("renders edit button for each game", () => {
    render(<GamesPage />);
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete button for each game", () => {
    render(<GamesPage />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls handleEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    vi.mocked(useGames).mockReturnValue({ ...mockHookReturn, handleEdit });

    render(<GamesPage />);
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith(mockGames[0]);
  });

  it("calls handleDeleteClick when delete button clicked", async () => {
    const user = userEvent.setup();
    const handleDeleteClick = vi.fn();
    vi.mocked(useGames).mockReturnValue({ ...mockHookReturn, handleDeleteClick });

    render(<GamesPage />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(handleDeleteClick).toHaveBeenCalledWith(1);
  });
});

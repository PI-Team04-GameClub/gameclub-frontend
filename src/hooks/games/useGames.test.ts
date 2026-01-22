import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGames } from "./useGames";
import { gameService } from "../../services/game_service";

vi.mock("../../services/game_service", () => ({
  gameService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useDisclosure: vi.fn(() => {
      let isOpen = false;
      return {
        isOpen,
        onOpen: vi.fn(() => {
          isOpen = true;
        }),
        onClose: vi.fn(() => {
          isOpen = false;
        }),
      };
    }),
  };
});

describe("useGames", () => {
  const mockGames = [
    { id: 1, name: "Chess", description: "Strategy game", numberOfPlayers: 2 },
    { id: 2, name: "Poker", description: "Card game", numberOfPlayers: 6 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gameService.getAll).mockResolvedValue(mockGames);
  });

  it("loads games on mount", async () => {
    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    expect(gameService.getAll).toHaveBeenCalled();
  });

  it("handles create action", async () => {
    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    act(() => {
      result.current.handleCreate();
    });

    expect(result.current.selectedGame).toBeUndefined();
  });

  it("handles edit action", async () => {
    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    act(() => {
      result.current.handleEdit(mockGames[0]);
    });

    expect(result.current.selectedGame).toEqual(mockGames[0]);
  });

  it("handles delete click", async () => {
    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles submit for creating new game", async () => {
    vi.mocked(gameService.create).mockResolvedValue({
      id: 3,
      name: "New Game",
      description: "New",
      numberOfPlayers: 4,
    });

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    const newGameData = {
      name: "New Game",
      description: "New",
      numberOfPlayers: 4,
    };

    await act(async () => {
      await result.current.handleSubmit(newGameData);
    });

    expect(gameService.create).toHaveBeenCalledWith(newGameData);
    expect(gameService.getAll).toHaveBeenCalledTimes(2);
  });

  it("handles submit for updating existing game", async () => {
    vi.mocked(gameService.update).mockResolvedValue({
      id: 1,
      name: "Updated",
      description: "Updated",
      numberOfPlayers: 3,
    });

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    act(() => {
      result.current.handleEdit(mockGames[0]);
    });

    const updateData = {
      name: "Updated",
      description: "Updated",
      numberOfPlayers: 3,
    };

    await act(async () => {
      await result.current.handleSubmit(updateData);
    });

    expect(gameService.update).toHaveBeenCalledWith(1, updateData);
  });

  it("handles delete action", async () => {
    vi.mocked(gameService.delete).mockResolvedValue(undefined);

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(gameService.delete).toHaveBeenCalledWith(1);
  });

  it("handles error when loading games", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(gameService.getAll).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading games:",
        expect.any(Error)
      );
    });

    expect(result.current.games).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when saving game", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(gameService.create).mockRejectedValueOnce(
      new Error("Save error")
    );

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    await act(async () => {
      await result.current.handleSubmit({
        name: "Test",
        description: "Test",
        numberOfPlayers: 2,
      });
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error saving game:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("handles error when deleting game", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(gameService.delete).mockRejectedValueOnce(
      new Error("Delete error")
    );

    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error deleting game:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not delete when gameToDelete is null", async () => {
    const { result } = renderHook(() => useGames());

    await waitFor(() => {
      expect(result.current.games).toEqual(mockGames);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(gameService.delete).not.toHaveBeenCalled();
  });
});

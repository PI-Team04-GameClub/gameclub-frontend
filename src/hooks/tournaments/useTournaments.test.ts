import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTournaments } from "./useTournaments";
import { tournamentService } from "../../services/tournament_service";

vi.mock("../../services/tournament_service", () => ({
  tournamentService: {
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

describe("useTournaments", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tournamentService.getAll).mockResolvedValue(mockTournaments);
  });

  it("loads tournaments on mount", async () => {
    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    expect(tournamentService.getAll).toHaveBeenCalled();
  });

  it("handles create action", async () => {
    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    act(() => {
      result.current.handleCreate();
    });

    expect(result.current.selectedTournament).toBeUndefined();
  });

  it("handles edit action", async () => {
    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    act(() => {
      result.current.handleEdit(mockTournaments[0]);
    });

    expect(result.current.selectedTournament).toEqual(mockTournaments[0]);
  });

  it("handles delete click", async () => {
    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles submit for creating new tournament", async () => {
    vi.mocked(tournamentService.create).mockResolvedValue({
      id: 3,
      name: "New Tournament",
      game: "Chess",
      prizePool: 2000,
      startDate: "2024-08-01T00:00:00Z",
      status: "Upcoming" as const,
      players: 8,
    });

    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    const newTournamentData = {
      name: "New Tournament",
      gameId: 1,
      prizePool: 2000,
      startDate: "2024-08-01T00:00:00Z",
      players: 8,
    };

    await act(async () => {
      await result.current.handleSubmit(newTournamentData);
    });

    expect(tournamentService.create).toHaveBeenCalledWith(newTournamentData);
    expect(tournamentService.getAll).toHaveBeenCalledTimes(2);
  });

  it("handles submit for updating existing tournament", async () => {
    vi.mocked(tournamentService.update).mockResolvedValue({
      id: 1,
      name: "Updated Tournament",
      game: "Chess",
      prizePool: 3000,
      startDate: "2024-06-01T00:00:00Z",
      status: "Active" as const,
      players: 16,
    });

    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    act(() => {
      result.current.handleEdit(mockTournaments[0]);
    });

    const updateData = {
      name: "Updated Tournament",
      gameId: 1,
      prizePool: 3000,
      startDate: "2024-06-01T00:00:00Z",
      players: 16,
    };

    await act(async () => {
      await result.current.handleSubmit(updateData);
    });

    expect(tournamentService.update).toHaveBeenCalledWith(1, updateData);
  });

  it("handles delete action", async () => {
    vi.mocked(tournamentService.delete).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(tournamentService.delete).toHaveBeenCalledWith(1);
  });

  it("handles error when loading tournaments", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(tournamentService.getAll).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading tournaments:",
        expect.any(Error),
      );
    });

    expect(result.current.tournaments).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when saving tournament", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(tournamentService.create).mockRejectedValueOnce(
      new Error("Save error"),
    );

    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    await act(async () => {
      await result.current.handleSubmit({
        name: "Test",
        gameId: 1,
        prizePool: 1000,
        startDate: "2024-01-01",
        players: 8,
      });
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error saving tournament:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("handles error when deleting tournament", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(tournamentService.delete).mockRejectedValueOnce(
      new Error("Delete error"),
    );

    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error deleting tournament:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("does not delete when tournamentToDelete is null", async () => {
    const { result } = renderHook(() => useTournaments());

    await waitFor(() => {
      expect(result.current.tournaments).toEqual(mockTournaments);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(tournamentService.delete).not.toHaveBeenCalled();
  });
});

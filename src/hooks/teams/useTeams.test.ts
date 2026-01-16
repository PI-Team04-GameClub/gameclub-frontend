import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTeams } from "./useTeams";
import { teamService } from "../../services/team_service";

vi.mock("../../services/team_service", () => ({
  teamService: {
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

describe("useTeams", () => {
  const mockTeams = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(teamService.getAll).mockResolvedValue(mockTeams);
  });

  it("loads teams on mount", async () => {
    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    expect(teamService.getAll).toHaveBeenCalled();
  });

  it("handles create action", async () => {
    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    act(() => {
      result.current.handleCreate();
    });

    expect(result.current.selectedTeam).toBeUndefined();
  });

  it("handles edit action", async () => {
    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    act(() => {
      result.current.handleEdit(mockTeams[0]);
    });

    expect(result.current.selectedTeam).toEqual(mockTeams[0]);
  });

  it("handles delete click", async () => {
    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles submit for creating new team", async () => {
    vi.mocked(teamService.create).mockResolvedValue({
      id: 3,
      name: "New Team",
    });

    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    const newTeamData = { name: "New Team" };

    await act(async () => {
      await result.current.handleSubmit(newTeamData);
    });

    expect(teamService.create).toHaveBeenCalledWith(newTeamData);
    expect(teamService.getAll).toHaveBeenCalledTimes(2);
  });

  it("handles submit for updating existing team", async () => {
    vi.mocked(teamService.update).mockResolvedValue({
      id: 1,
      name: "Updated Team",
    });

    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    act(() => {
      result.current.handleEdit(mockTeams[0]);
    });

    const updateData = { name: "Updated Team" };

    await act(async () => {
      await result.current.handleSubmit(updateData);
    });

    expect(teamService.update).toHaveBeenCalledWith(1, updateData);
  });

  it("handles delete action", async () => {
    vi.mocked(teamService.delete).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(teamService.delete).toHaveBeenCalledWith(1);
  });

  it("handles error when loading teams", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(teamService.getAll).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading teams:",
        expect.any(Error),
      );
    });

    expect(result.current.teams).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when saving team", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(teamService.create).mockRejectedValueOnce(new Error("Save error"));

    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error saving team:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("handles error when deleting team", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(teamService.delete).mockRejectedValueOnce(new Error("Delete error"));

    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    act(() => {
      result.current.handleDeleteClick(1);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(consoleError).toHaveBeenCalledWith(
      "Error deleting team:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("does not delete when teamToDelete is null", async () => {
    const { result } = renderHook(() => useTeams());

    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(teamService.delete).not.toHaveBeenCalled();
  });
});

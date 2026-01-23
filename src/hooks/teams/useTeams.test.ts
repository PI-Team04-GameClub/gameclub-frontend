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
    // Act
    const { result } = renderHook(() => useTeams());

    // Assert
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });
    expect(teamService.getAll).toHaveBeenCalled();
  });

  it("handles create action", async () => {
    // Arrange
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    // Act
    act(() => {
      result.current.handleCreate();
    });

    // Assert
    expect(result.current.selectedTeam).toBeUndefined();
  });

  it("handles edit action", async () => {
    // Arrange
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    // Act
    act(() => {
      result.current.handleEdit(mockTeams[0]);
    });

    // Assert
    expect(result.current.selectedTeam).toEqual(mockTeams[0]);
  });

  it("handles delete click", async () => {
    // Arrange
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    // Act
    act(() => {
      result.current.handleDeleteClick(1);
    });

    // Assert
    expect(result.current.isDeleteDialogOpen).toBeDefined();
  });

  it("handles submit for creating new team", async () => {
    // Arrange
    vi.mocked(teamService.create).mockResolvedValue({
      id: 3,
      name: "New Team",
    });
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });
    const newTeamData = { name: "New Team" };

    // Act
    await act(async () => {
      await result.current.handleSubmit(newTeamData);
    });

    // Assert
    expect(teamService.create).toHaveBeenCalledWith(newTeamData);
    expect(teamService.getAll).toHaveBeenCalledTimes(2);
  });

  it("handles submit for updating existing team", async () => {
    // Arrange
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

    // Act
    await act(async () => {
      await result.current.handleSubmit(updateData);
    });

    // Assert
    expect(teamService.update).toHaveBeenCalledWith(1, updateData);
  });

  it("handles delete action", async () => {
    // Arrange
    vi.mocked(teamService.delete).mockResolvedValue(undefined);
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });
    act(() => {
      result.current.handleDeleteClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleDelete();
    });

    // Assert
    expect(teamService.delete).toHaveBeenCalledWith(1);
  });

  it("handles error when loading teams", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(teamService.getAll).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const { result } = renderHook(() => useTeams());

    // Assert
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading teams:",
        expect.any(Error)
      );
    });
    expect(result.current.teams).toEqual([]);
    consoleError.mockRestore();
  });

  it("handles error when saving team", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(teamService.create).mockRejectedValueOnce(
      new Error("Save error")
    );
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    // Act
    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error saving team:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("handles error when deleting team", async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(teamService.delete).mockRejectedValueOnce(
      new Error("Delete error")
    );
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });
    act(() => {
      result.current.handleDeleteClick(1);
    });

    // Act
    await act(async () => {
      await result.current.handleDelete();
    });

    // Assert
    expect(consoleError).toHaveBeenCalledWith(
      "Error deleting team:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  it("does not delete when teamToDelete is null", async () => {
    // Arrange
    const { result } = renderHook(() => useTeams());
    await waitFor(() => {
      expect(result.current.teams).toEqual(mockTeams);
    });

    // Act
    await act(async () => {
      await result.current.handleDelete();
    });

    // Assert
    expect(teamService.delete).not.toHaveBeenCalled();
  });
});

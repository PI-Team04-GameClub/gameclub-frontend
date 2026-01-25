import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { TournamentModal } from "./TournamentModal";
import { gameService } from "../../../services/game_service";

vi.mock("../../../services/game_service", () => ({
  gameService: {
    getAll: vi.fn(),
  },
}));

// Helper to create alert mock
const createAlertMock = () =>
  vi.spyOn(globalThis, "alert").mockImplementation(() => {});

describe("TournamentModal", () => {
  const mockGames = [
    { id: 1, name: "Chess", description: "Strategy game", numberOfPlayers: 2 },
    { id: 2, name: "Poker", description: "Card game", numberOfPlayers: 6 },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gameService.getAll).mockResolvedValue(mockGames);
  });

  it("renders create modal when no tournament provided", async () => {
    render(<TournamentModal {...defaultProps} />);
    expect(screen.getByText("Create Tournament")).toBeInTheDocument();
  });

  it("renders update modal when tournament provided", async () => {
    const tournament = {
      id: 1,
      name: "Championship",
      game: "Chess",
      prizePool: 1000,
      startDate: "2024-06-01T00:00:00Z",
      status: "Active" as const,
      players: 16,
    };
    render(<TournamentModal {...defaultProps} tournament={tournament} />);
    expect(screen.getByText("Update Tournament")).toBeInTheDocument();
  });

  it("renders form fields", async () => {
    render(<TournamentModal {...defaultProps} />);
    expect(screen.getByText("Tournament Name *")).toBeInTheDocument();
    expect(screen.getByText("Game *")).toBeInTheDocument();
    expect(screen.getByText("Prize Pool *")).toBeInTheDocument();
    expect(screen.getByText("Start Date *")).toBeInTheDocument();
  });

  it("loads games on mount", async () => {
    render(<TournamentModal {...defaultProps} />);

    await waitFor(() => {
      expect(gameService.getAll).toHaveBeenCalled();
    });
  });

  it("renders cancel button", () => {
    render(<TournamentModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders create button when no tournament", () => {
    render(<TournamentModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders update button when tournament provided", () => {
    const tournament = {
      id: 1,
      name: "Championship",
      game: "Chess",
      prizePool: 1000,
      startDate: "2024-06-01T00:00:00Z",
      status: "Active" as const,
      players: 16,
    };
    render(<TournamentModal {...defaultProps} tournament={tournament} />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TournamentModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("populates form with tournament data when tournament provided", async () => {
    const tournament = {
      id: 1,
      name: "Championship",
      game: "Chess",
      prizePool: 1000,
      startDate: "2024-06-01T00:00:00Z",
      status: "Active" as const,
      players: 16,
    };

    render(<TournamentModal {...defaultProps} tournament={tournament} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter tournament name")).toHaveValue(
        "Championship"
      );
    });
  });

  it("allows typing in name field", async () => {
    const user = userEvent.setup();
    render(<TournamentModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("Enter tournament name");
    await user.type(nameInput, "New Tournament");
    expect(nameInput).toHaveValue("New Tournament");
  });

  it("renders game select with options", async () => {
    render(<TournamentModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("does not render when closed", () => {
    render(<TournamentModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Create Tournament")).not.toBeInTheDocument();
  });

  it("handles error when loading games fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(gameService.getAll).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<TournamentModal {...defaultProps} />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error loading games:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });

  it("shows alert when submitting without game", async () => {
    const user = userEvent.setup();
    const alertMock = createAlertMock();

    render(<TournamentModal {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText("Enter tournament name"),
      "Test"
    );
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(alertMock).toHaveBeenCalledWith("Please select a game");
    alertMock.mockRestore();
  });

  it("shows alert when submitting without name", async () => {
    const user = userEvent.setup();
    const alertMock = createAlertMock();

    render(<TournamentModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByRole("combobox"), "1");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(alertMock).toHaveBeenCalledWith("Please enter a tournament name");
    alertMock.mockRestore();
  });

  it("shows alert when submitting without date", async () => {
    const user = userEvent.setup();
    const alertMock = createAlertMock();

    render(<TournamentModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter tournament name"),
      "Test"
    );
    await user.selectOptions(screen.getByRole("combobox"), "1");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(alertMock).toHaveBeenCalledWith("Please select a start date");
    alertMock.mockRestore();
  });

  it("shows alert when prize pool is zero or negative", async () => {
    const user = userEvent.setup();
    const alertMock = createAlertMock();

    render(<TournamentModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter tournament name"),
      "Test"
    );
    await user.selectOptions(screen.getByRole("combobox"), "1");

    const dateInput = screen.getByDisplayValue("");
    await user.type(dateInput, "2024-06-01");

    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(alertMock).toHaveBeenCalledWith("Prize pool must be greater than 0");
    alertMock.mockRestore();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <TournamentModal
        {...defaultProps}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter tournament name"),
      "New Tournament"
    );
    await user.selectOptions(screen.getByRole("combobox"), "1");

    const prizePoolInput = screen.getByPlaceholderText("e.g., 1000");
    await user.clear(prizePoolInput);
    await user.type(prizePoolInput, "500");

    // Find date input by type attribute
    const dateInput = document.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    await user.type(dateInput, "2024-06-15");

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Tournament",
          gameId: 1,
          prizePool: 500,
        })
      );
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("allows changing prize pool value", async () => {
    const user = userEvent.setup();
    render(<TournamentModal {...defaultProps} />);

    const prizePoolInput = screen.getByPlaceholderText("e.g., 1000");
    await user.clear(prizePoolInput);
    await user.type(prizePoolInput, "2500");

    expect(prizePoolInput).toHaveValue(2500);
  });

  it("allows changing start date", async () => {
    const user = userEvent.setup();
    render(<TournamentModal {...defaultProps} />);

    // Find date input by type attribute
    const dateInput = document.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    await user.type(dateInput, "2024-12-25");

    expect(dateInput).toHaveValue("2024-12-25");
  });
});

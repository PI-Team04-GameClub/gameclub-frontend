import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { GameModal } from "./GameModal";

describe("GameModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create modal when no game provided", () => {
    render(<GameModal {...defaultProps} />);
    expect(screen.getByText("Create Game")).toBeInTheDocument();
  });

  it("renders update modal when game provided", () => {
    const game = {
      id: 1,
      name: "Chess",
      description: "Strategy game",
      numberOfPlayers: 2,
    };
    render(<GameModal {...defaultProps} game={game} />);
    expect(screen.getByText("Update Game")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    render(<GameModal {...defaultProps} />);
    expect(screen.getByText("Game Name *")).toBeInTheDocument();
    expect(screen.getByText("Description *")).toBeInTheDocument();
    expect(screen.getByText("Number of Players *")).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(<GameModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders create button when no game", () => {
    render(<GameModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders update button when game provided", () => {
    const game = {
      id: 1,
      name: "Chess",
      description: "Strategy game",
      numberOfPlayers: 2,
    };
    render(<GameModal {...defaultProps} game={game} />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<GameModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("populates form with game data when game provided", () => {
    const game = {
      id: 1,
      name: "Chess",
      description: "Strategy game",
      numberOfPlayers: 2,
    };
    render(<GameModal {...defaultProps} game={game} />);

    expect(screen.getByPlaceholderText("Enter game name")).toHaveValue("Chess");
    expect(screen.getByPlaceholderText("Enter game description")).toHaveValue(
      "Strategy game"
    );
  });

  it("clears form when closed without game", async () => {
    const { rerender } = render(<GameModal {...defaultProps} isOpen={false} />);
    rerender(<GameModal {...defaultProps} isOpen={true} />);

    expect(screen.getByPlaceholderText("Enter game name")).toHaveValue("");
  });

  it("allows typing in name field", async () => {
    const user = userEvent.setup();
    render(<GameModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("Enter game name");
    await user.type(nameInput, "New Game");
    expect(nameInput).toHaveValue("New Game");
  });

  it("allows typing in description field", async () => {
    const user = userEvent.setup();
    render(<GameModal {...defaultProps} />);

    const descInput = screen.getByPlaceholderText("Enter game description");
    await user.type(descInput, "A fun game");
    expect(descInput).toHaveValue("A fun game");
  });

  it("calls onSubmit and onClose when form submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <GameModal {...defaultProps} onSubmit={onSubmit} onClose={onClose} />
    );

    await user.type(
      screen.getByPlaceholderText("Enter game name"),
      "Test Game"
    );
    await user.type(
      screen.getByPlaceholderText("Enter game description"),
      "Test Desc"
    );
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Test Game",
        description: "Test Desc",
        numberOfPlayers: 2,
      });
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    render(<GameModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Create Game")).not.toBeInTheDocument();
  });

  it("allows changing number of players", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <GameModal {...defaultProps} onSubmit={onSubmit} onClose={onClose} />
    );

    const numberInput = screen.getByPlaceholderText("Enter number of players");
    // Use fireEvent.change for NumberInput as it handles value changes more reliably
    fireEvent.change(numberInput, { target: { value: "5" } });

    await user.type(
      screen.getByPlaceholderText("Enter game name"),
      "Test Game"
    );
    await user.type(
      screen.getByPlaceholderText("Enter game description"),
      "Test Desc"
    );
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Test Game",
        description: "Test Desc",
        numberOfPlayers: 5,
      });
    });
  });
});

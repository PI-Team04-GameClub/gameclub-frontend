import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import TeamsPage from "./TeamsPage";
import { useTeams } from "../../hooks";

vi.mock("../../hooks", () => ({
  useTeams: vi.fn(),
}));

describe("TeamsPage", () => {
  const mockTeams = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
  ];

  const mockHookReturn = {
    teams: mockTeams,
    selectedTeam: undefined,
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
    vi.mocked(useTeams).mockReturnValue(mockHookReturn);
  });

  it("renders page header with title", () => {
    // Arrange & Act
    render(<TeamsPage />);

    // Assert
    expect(screen.getByText("Teams")).toBeInTheDocument();
  });

  it("renders create team button", () => {
    // Arrange & Act
    render(<TeamsPage />);

    // Assert
    expect(
      screen.getByRole("button", { name: /create team/i })
    ).toBeInTheDocument();
  });

  it("renders teams table", () => {
    // Arrange & Act
    render(<TeamsPage />);

    // Assert
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Team Beta")).toBeInTheDocument();
  });

  it("calls handleCreate when create button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    vi.mocked(useTeams).mockReturnValue({ ...mockHookReturn, handleCreate });
    render(<TeamsPage />);

    // Act
    await user.click(screen.getByRole("button", { name: /create team/i }));

    // Assert
    expect(handleCreate).toHaveBeenCalled();
  });

  it("renders modal when isModalOpen is true", () => {
    // Arrange
    vi.mocked(useTeams).mockReturnValue({
      ...mockHookReturn,
      isModalOpen: true,
    });

    // Act
    render(<TeamsPage />);

    // Assert
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Create Team")).toBeInTheDocument();
  });

  it("renders delete dialog when isDeleteDialogOpen is true", () => {
    // Arrange
    vi.mocked(useTeams).mockReturnValue({
      ...mockHookReturn,
      isDeleteDialogOpen: true,
    });

    // Act
    render(<TeamsPage />);

    // Assert
    expect(screen.getByText("Delete Team")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ).toBeInTheDocument();
  });

  it("renders edit button for each team", () => {
    // Arrange & Act
    render(<TeamsPage />);

    // Assert
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete button for each team", () => {
    // Arrange & Act
    render(<TeamsPage />);

    // Assert
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls handleEdit when edit button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    vi.mocked(useTeams).mockReturnValue({ ...mockHookReturn, handleEdit });
    render(<TeamsPage />);

    // Act
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Assert
    expect(handleEdit).toHaveBeenCalledWith(mockTeams[0]);
  });

  it("calls handleDeleteClick when delete button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleDeleteClick = vi.fn();
    vi.mocked(useTeams).mockReturnValue({
      ...mockHookReturn,
      handleDeleteClick,
    });
    render(<TeamsPage />);

    // Act
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    expect(handleDeleteClick).toHaveBeenCalledWith(1);
  });
});

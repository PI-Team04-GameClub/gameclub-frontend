import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import TeamsTable from "./TeamsTable";

describe("TeamsTable", () => {
  const mockTeams = [
    { id: 1, name: "Team Alpha" },
    { id: 2, name: "Team Beta" },
  ];

  const defaultProps = {
    teams: mockTeams,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("renders table headers", () => {
    // Arrange & Act
    render(<TeamsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Team Name")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders team ids", () => {
    // Arrange & Act
    render(<TeamsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders team names", () => {
    // Arrange & Act
    render(<TeamsTable {...defaultProps} />);

    // Assert
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Team Beta")).toBeInTheDocument();
  });

  it("renders edit buttons for each team", () => {
    // Arrange & Act
    render(<TeamsTable {...defaultProps} />);

    // Assert
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete buttons for each team", () => {
    // Arrange & Act
    render(<TeamsTable {...defaultProps} />);

    // Assert
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls onEdit with correct team when edit button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TeamsTable {...defaultProps} onEdit={onEdit} />);

    // Act
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Assert
    expect(onEdit).toHaveBeenCalledWith(mockTeams[0]);
  });

  it("calls onDelete with correct id when delete button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TeamsTable {...defaultProps} onDelete={onDelete} />);

    // Act
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("renders empty table when no teams provided", () => {
    // Arrange & Act
    render(<TeamsTable {...defaultProps} teams={[]} />);

    // Assert
    expect(screen.getByText("Team Name")).toBeInTheDocument();
    expect(screen.queryByText("Team Alpha")).not.toBeInTheDocument();
  });
});

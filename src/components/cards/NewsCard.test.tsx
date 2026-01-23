import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import NewsCard from "./NewsCard";

describe("NewsCard", () => {
  const mockNews = {
    id: 1,
    title: "Test News Title",
    description: "Test news description content",
    author: "John Doe",
    date: "2024-01-15",
  };

  it("renders news title", () => {
    // Arrange & Act
    render(<NewsCard news={mockNews} />);

    // Assert
    expect(screen.getByText("Test News Title")).toBeInTheDocument();
  });

  it("renders news description", () => {
    // Arrange & Act
    render(<NewsCard news={mockNews} />);

    // Assert
    expect(
      screen.getByText("Test news description content")
    ).toBeInTheDocument();
  });

  it("renders author name", () => {
    // Arrange & Act
    render(<NewsCard news={mockNews} />);

    // Assert
    expect(screen.getByText("By John Doe")).toBeInTheDocument();
  });

  it("renders date", () => {
    // Arrange & Act
    render(<NewsCard news={mockNews} />);

    // Assert
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("renders action buttons when onEdit is provided", () => {
    // Arrange
    const onEdit = vi.fn();

    // Act
    render(<NewsCard news={mockNews} onEdit={onEdit} />);

    // Assert
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("renders action buttons when onDelete is provided", () => {
    // Arrange
    const onDelete = vi.fn();

    // Act
    render(<NewsCard news={mockNews} onDelete={onDelete} />);

    // Assert
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("does not render action buttons when no handlers provided", () => {
    // Arrange & Act
    render(<NewsCard news={mockNews} />);

    // Assert
    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });

  it("calls onEdit with news when edit button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<NewsCard news={mockNews} onEdit={onEdit} />);

    // Act
    await user.click(screen.getByRole("button", { name: /edit/i }));

    // Assert
    expect(onEdit).toHaveBeenCalledWith(mockNews);
  });

  it("calls onDelete with news id when delete button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<NewsCard news={mockNews} onDelete={onDelete} />);

    // Act
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Assert
    expect(onDelete).toHaveBeenCalledWith(mockNews.id);
  });

  it("renders both edit and delete buttons when both handlers provided", () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Act
    render(<NewsCard news={mockNews} onEdit={onEdit} onDelete={onDelete} />);

    // Assert
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});

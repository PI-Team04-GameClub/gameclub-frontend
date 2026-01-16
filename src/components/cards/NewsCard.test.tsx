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
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText("Test News Title")).toBeInTheDocument();
  });

  it("renders news description", () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText("Test news description content")).toBeInTheDocument();
  });

  it("renders author name", () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText("By John Doe")).toBeInTheDocument();
  });

  it("renders date", () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("renders action buttons when onEdit is provided", () => {
    const onEdit = vi.fn();
    render(<NewsCard news={mockNews} onEdit={onEdit} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("renders action buttons when onDelete is provided", () => {
    const onDelete = vi.fn();
    render(<NewsCard news={mockNews} onDelete={onDelete} />);
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("does not render action buttons when no handlers provided", () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("calls onEdit with news when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<NewsCard news={mockNews} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockNews);
  });

  it("calls onDelete with news id when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<NewsCard news={mockNews} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(mockNews.id);
  });

  it("renders both edit and delete buttons when both handlers provided", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<NewsCard news={mockNews} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});

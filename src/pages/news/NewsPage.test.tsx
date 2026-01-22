import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import NewsPage from "./NewsPage";
import { useNews } from "../../hooks";

vi.mock("../../hooks", () => ({
  useNews: vi.fn(),
}));

describe("NewsPage", () => {
  const mockNews = [
    {
      id: 1,
      title: "News 1",
      description: "Description 1",
      author: "John Doe",
      date: "2024-01-01",
    },
    {
      id: 2,
      title: "News 2",
      description: "Description 2",
      author: "Jane Doe",
      date: "2024-01-02",
    },
  ];

  const mockHookReturn = {
    newsItems: mockNews,
    selectedNews: undefined,
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
    vi.mocked(useNews).mockReturnValue(mockHookReturn);
  });

  it("renders page header with title", () => {
    render(<NewsPage />);
    expect(screen.getByText("News & Updates")).toBeInTheDocument();
  });

  it("renders create post button", () => {
    render(<NewsPage />);
    expect(
      screen.getByRole("button", { name: /create post/i })
    ).toBeInTheDocument();
  });

  it("renders news cards", () => {
    render(<NewsPage />);
    expect(screen.getByText("News 1")).toBeInTheDocument();
    expect(screen.getByText("News 2")).toBeInTheDocument();
  });

  it("calls handleCreate when create button clicked", async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    vi.mocked(useNews).mockReturnValue({ ...mockHookReturn, handleCreate });

    render(<NewsPage />);
    await user.click(screen.getByRole("button", { name: /create post/i }));

    expect(handleCreate).toHaveBeenCalled();
  });

  it("renders modal when isModalOpen is true", () => {
    vi.mocked(useNews).mockReturnValue({
      ...mockHookReturn,
      isModalOpen: true,
    });

    render(<NewsPage />);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Create News Post")).toBeInTheDocument();
  });

  it("renders delete dialog when isDeleteDialogOpen is true", () => {
    vi.mocked(useNews).mockReturnValue({
      ...mockHookReturn,
      isDeleteDialogOpen: true,
    });

    render(<NewsPage />);
    expect(screen.getByText("Delete News Post")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this news post? This action cannot be undone."
      )
    ).toBeInTheDocument();
  });

  it("renders edit button for each news card", () => {
    render(<NewsPage />);
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete button for each news card", () => {
    render(<NewsPage />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls handleEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    vi.mocked(useNews).mockReturnValue({ ...mockHookReturn, handleEdit });

    render(<NewsPage />);
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith(mockNews[0]);
  });

  it("calls handleDeleteClick when delete button clicked", async () => {
    const user = userEvent.setup();
    const handleDeleteClick = vi.fn();
    vi.mocked(useNews).mockReturnValue({
      ...mockHookReturn,
      handleDeleteClick,
    });

    render(<NewsPage />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(handleDeleteClick).toHaveBeenCalledWith(1);
  });

  it("renders author and date in news cards", () => {
    render(<NewsPage />);
    expect(screen.getByText("By John Doe")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });
});

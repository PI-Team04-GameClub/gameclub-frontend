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
    // Arrange & Act
    render(<NewsPage />);

    // Assert
    expect(screen.getByText("News & Updates")).toBeInTheDocument();
  });

  it("renders create post button", () => {
    // Arrange & Act
    render(<NewsPage />);

    // Assert
    expect(
      screen.getByRole("button", { name: /create post/i })
    ).toBeInTheDocument();
  });

  it("renders news cards", () => {
    // Arrange & Act
    render(<NewsPage />);

    // Assert
    expect(screen.getByText("News 1")).toBeInTheDocument();
    expect(screen.getByText("News 2")).toBeInTheDocument();
  });

  it("calls handleCreate when create button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleCreate = vi.fn();
    vi.mocked(useNews).mockReturnValue({ ...mockHookReturn, handleCreate });
    render(<NewsPage />);

    // Act
    await user.click(screen.getByRole("button", { name: /create post/i }));

    // Assert
    expect(handleCreate).toHaveBeenCalled();
  });

  it("renders modal when isModalOpen is true", () => {
    // Arrange
    vi.mocked(useNews).mockReturnValue({
      ...mockHookReturn,
      isModalOpen: true,
    });

    // Act
    render(<NewsPage />);

    // Assert
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Create News Post")).toBeInTheDocument();
  });

  it("renders delete dialog when isDeleteDialogOpen is true", () => {
    // Arrange
    vi.mocked(useNews).mockReturnValue({
      ...mockHookReturn,
      isDeleteDialogOpen: true,
    });

    // Act
    render(<NewsPage />);

    // Assert
    expect(screen.getByText("Delete News Post")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this news post? This action cannot be undone."
      )
    ).toBeInTheDocument();
  });

  it("renders edit button for each news card", () => {
    // Arrange & Act
    render(<NewsPage />);

    // Assert
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
  });

  it("renders delete button for each news card", () => {
    // Arrange & Act
    render(<NewsPage />);

    // Assert
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it("calls handleEdit when edit button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    vi.mocked(useNews).mockReturnValue({ ...mockHookReturn, handleEdit });
    render(<NewsPage />);

    // Act
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    // Assert
    expect(handleEdit).toHaveBeenCalledWith(mockNews[0]);
  });

  it("calls handleDeleteClick when delete button clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleDeleteClick = vi.fn();
    vi.mocked(useNews).mockReturnValue({
      ...mockHookReturn,
      handleDeleteClick,
    });
    render(<NewsPage />);

    // Act
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    expect(handleDeleteClick).toHaveBeenCalledWith(1);
  });

  it("renders author and date in news cards", () => {
    // Arrange & Act
    render(<NewsPage />);

    // Assert
    expect(screen.getByText("By John Doe")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });
});

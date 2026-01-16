import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { NewsModal } from "./NewsModal";

describe("NewsModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create modal when no news provided", () => {
    render(<NewsModal {...defaultProps} />);
    expect(screen.getByText("Create News Post")).toBeInTheDocument();
  });

  it("renders update modal when news provided", () => {
    const news = {
      id: 1,
      title: "Test News",
      description: "Test description",
      author: "John Doe",
      date: "2024-01-01",
    };
    render(<NewsModal {...defaultProps} news={news} />);
    expect(screen.getByText("Update News Post")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    render(<NewsModal {...defaultProps} />);
    expect(screen.getByText("Title *")).toBeInTheDocument();
    expect(screen.getByText("Description *")).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(<NewsModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders create button when no news", () => {
    render(<NewsModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("renders update button when news provided", () => {
    const news = {
      id: 1,
      title: "Test News",
      description: "Test description",
      author: "John Doe",
      date: "2024-01-01",
    };
    render(<NewsModal {...defaultProps} news={news} />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<NewsModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("populates form with news data when news provided", () => {
    const news = {
      id: 1,
      title: "Test News",
      description: "Test description",
      author: "John Doe",
      date: "2024-01-01",
    };
    render(<NewsModal {...defaultProps} news={news} />);

    expect(screen.getByPlaceholderText("Enter post title")).toHaveValue("Test News");
    expect(screen.getByPlaceholderText("Enter post description")).toHaveValue(
      "Test description",
    );
  });

  it("allows typing in title field", async () => {
    const user = userEvent.setup();
    render(<NewsModal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText("Enter post title");
    await user.type(titleInput, "New News");
    expect(titleInput).toHaveValue("New News");
  });

  it("allows typing in description field", async () => {
    const user = userEvent.setup();
    render(<NewsModal {...defaultProps} />);

    const descInput = screen.getByPlaceholderText("Enter post description");
    await user.type(descInput, "News content");
    expect(descInput).toHaveValue("News content");
  });

  it("calls onSubmit and onClose when form submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(<NewsModal {...defaultProps} onSubmit={onSubmit} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText("Enter post title"), "Test Title");
    await user.type(screen.getByPlaceholderText("Enter post description"), "Test Content");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Test Title",
        description: "Test Content",
      });
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when closed", () => {
    render(<NewsModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Create News Post")).not.toBeInTheDocument();
  });

  it("clears form when no news and modal reopens", async () => {
    const { rerender } = render(<NewsModal {...defaultProps} isOpen={false} />);
    rerender(<NewsModal {...defaultProps} isOpen={true} />);

    expect(screen.getByPlaceholderText("Enter post title")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter post description")).toHaveValue("");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { CommentSection } from "./CommentSection";
import { commentService } from "../../services/comment_service";
import { authService } from "../../services/auth_service";

vi.mock("../../services/comment_service", () => ({
  commentService: {
    getByNewsId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../services/auth_service", () => ({
  authService: {
    getToken: vi.fn(),
    getUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("CommentSection", () => {
  const mockComments = [
    {
      id: 1,
      content: "Great article!",
      user_id: 1,
      user_name: "John Doe",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 10:00:00",
      updated_at: "2024-01-01 10:00:00",
    },
    {
      id: 2,
      content: "Very informative",
      user_id: 2,
      user_name: "Jane Smith",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 11:00:00",
      updated_at: "2024-01-01 11:00:00",
    },
  ];

  const mockUser = {
    id: 1,
    email: "test@test.com",
    first_name: "John",
    last_name: "Doe",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(commentService.getByNewsId).mockResolvedValue(mockComments);
    vi.mocked(authService.getToken).mockReturnValue("mock-token");
    vi.mocked(authService.getUser).mockReturnValue(mockUser);
  });

  it("renders comments", async () => {
    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Great article!")).toBeInTheDocument();
      expect(screen.getByText("Very informative")).toBeInTheDocument();
    });
  });

  it("displays comment count", async () => {
    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Comments (2)")).toBeInTheDocument();
    });
  });

  it("displays user names", async () => {
    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("shows empty state when no comments", async () => {
    vi.mocked(commentService.getByNewsId).mockResolvedValue([]);

    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText("No comments yet. Be the first to comment!")
      ).toBeInTheDocument();
    });
  });

  it("allows logged in user to write a comment", async () => {
    const user = userEvent.setup();
    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Write a comment...")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Write a comment...");
    await user.type(textarea, "My new comment");

    expect(textarea).toHaveValue("My new comment");
  });

  it("submits a new comment", async () => {
    const user = userEvent.setup();
    const newComment = {
      id: 3,
      content: "My new comment",
      user_id: 1,
      user_name: "John Doe",
      news_id: 1,
      news_title: "News 1",
      created_at: "2024-01-01 12:00:00",
      updated_at: "2024-01-01 12:00:00",
    };
    vi.mocked(commentService.create).mockResolvedValue(newComment);

    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Write a comment...")
      ).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Write a comment...");
    await user.type(textarea, "My new comment");

    const postButton = screen.getByRole("button", { name: "Post" });
    await user.click(postButton);

    await waitFor(() => {
      expect(commentService.create).toHaveBeenCalledWith({
        content: "My new comment",
        user_id: 1,
        news_id: 1,
      });
    });
  });

  it("shows edit button for user's own comments", async () => {
    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText("Edit comment");
      expect(editButtons).toHaveLength(1);
    });
  });

  it("shows delete button for user's own comments", async () => {
    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText("Delete comment");
      expect(deleteButtons).toHaveLength(1);
    });
  });

  it("deletes a comment when delete button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(commentService.delete).mockResolvedValue();

    render(<CommentSection newsId={1} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Delete comment")).toBeInTheDocument();
    });

    const deleteButton = screen.getByLabelText("Delete comment");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(commentService.delete).toHaveBeenCalledWith(1);
    });
  });
});

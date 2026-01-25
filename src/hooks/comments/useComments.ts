import { useState, useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { commentService } from "../../services/comment_service";
import { authService } from "../../services/auth_service";
import { Comment } from "../../types";

export const useComments = (newsId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const loadComments = useCallback(async () => {
    if (!newsId) return;
    setIsLoading(true);
    try {
      const data = await commentService.getByNewsId(newsId);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [newsId]);

  const handleCreate = useCallback(() => {
    setSelectedComment(undefined);
    onModalOpen();
  }, [onModalOpen]);

  const handleEdit = useCallback(
    (comment: Comment) => {
      setSelectedComment(comment);
      onModalOpen();
    },
    [onModalOpen]
  );

  const handleSubmit = useCallback(
    async (content: string) => {
      try {
        const user = authService.getUser();
        if (!user) {
          console.error("No user logged in");
          return;
        }

        if (selectedComment) {
          await commentService.update(selectedComment.id, { content });
        } else {
          await commentService.create({
            content,
            user_id: user.id,
            news_id: newsId,
          });
        }
        setSelectedComment(undefined);
        onModalClose();
        loadComments();
      } catch (error) {
        console.error("Error saving comment:", error);
      }
    },
    [selectedComment, newsId, loadComments, onModalClose]
  );

  const handleDelete = useCallback(
    async (commentId: number) => {
      try {
        await commentService.delete(commentId);
        loadComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
    [loadComments]
  );

  return {
    comments,
    selectedComment,
    isLoading,
    isModalOpen,
    onModalClose,
    loadComments,
    handleCreate,
    handleEdit,
    handleSubmit,
    handleDelete,
  };
};

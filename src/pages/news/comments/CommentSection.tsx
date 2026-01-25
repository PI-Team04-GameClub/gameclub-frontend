import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useComments } from "../../../hooks";
import { useAuth } from "../../../context";
import { Comment } from "../../../types";
import { CommentBox } from "../../../components/inputs";

interface CommentSectionProps {
  newsId: number;
}

const CommentItem: React.FC<{
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  currentUserId?: number;
}> = ({ comment, onEdit, onDelete, currentUserId }) => {
  const canModify = currentUserId === comment.user_id;

  return (
    <Box py={3}>
      <HStack align="start" spacing={3}>
        <Avatar size="sm" name={comment.user_name} />
        <VStack align="stretch" flex={1} spacing={1}>
          <HStack justify="space-between">
            <Text fontWeight="600" fontSize="sm">
              {comment.user_name}
            </Text>
            <HStack>
              <Text fontSize="xs" color="gray.500">
                {comment.created_at}
              </Text>
              {canModify && onEdit && (
                <IconButton
                  aria-label="Edit comment"
                  icon={<EditIcon />}
                  size="xs"
                  variant="ghost"
                  onClick={() => onEdit(comment)}
                />
              )}
              {canModify && onDelete && (
                <IconButton
                  aria-label="Delete comment"
                  icon={<DeleteIcon />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(comment.id)}
                />
              )}
            </HStack>
          </HStack>
          <Text fontSize="sm" color="gray.700">
            {comment.content}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ newsId }) => {
  const { user } = useAuth();
  const {
    comments,
    selectedComment,
    isLoading,
    loadComments,
    handleEdit,
    handleSubmit,
    handleDelete,
  } = useComments(newsId);

  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (selectedComment) {
      setNewComment(selectedComment.content);
      setIsEditing(true);
    }
  }, [selectedComment]);

  const onSubmit = async () => {
    if (!newComment.trim()) return;

    await handleSubmit(newComment);
    setNewComment("");
    setIsEditing(false);
  };

  const onCancel = () => {
    setNewComment("");
    setIsEditing(false);
  };

  const onEditClick = (comment: Comment) => {
    handleEdit(comment);
  };

  const onDeleteClick = (commentId: number) => {
    handleDelete(commentId);
  };

  return (
    <Box mt={4}>
      <Text fontWeight="600" mb={3}>
        Comments ({comments.length})
      </Text>

      {user && (
        <CommentBox
          value={newComment}
          onChange={setNewComment}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isEditing={isEditing}
        />
      )}

      <Divider />

      <VStack align="stretch" spacing={0} divider={<Divider />}>
        {isLoading ? (
          <Text py={4} textAlign="center" color="gray.500">
            Loading comments...
          </Text>
        ) : comments.length === 0 ? (
          <Text py={4} textAlign="center" color="gray.500">
            No comments yet. Be the first to comment!
          </Text>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
              currentUserId={user?.id}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};

export default CommentSection;

import React from "react";
import { Box, HStack, Button, Textarea } from "@chakra-ui/react";

interface CommentBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const CommentBox: React.FC<CommentBoxProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  return (
    <Box mb={4}>
      <Textarea
        placeholder="Write a comment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        resize="none"
      />
      <HStack mt={2} justify="flex-end">
        {isEditing && onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          colorScheme="brand"
          size="sm"
          onClick={onSubmit}
          isDisabled={!value.trim()}
        >
          {isEditing ? "Update" : "Post"}
        </Button>
      </HStack>
    </Box>
  );
};

export default CommentBox;

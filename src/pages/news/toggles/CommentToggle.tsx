import React, { useState } from "react";
import { Box, Button, Collapse } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { CommentSection } from "../comments";

interface CommentToggleProps {
  newsId: number;
}

const CommentToggle: React.FC<CommentToggleProps> = ({ newsId }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <Box mt={4}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ChatIcon />}
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </Button>
      </Box>

      <Collapse in={showComments} animateOpacity>
        <CommentSection newsId={newsId} />
      </Collapse>
    </>
  );
};

export default CommentToggle;

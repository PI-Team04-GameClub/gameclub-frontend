import React from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { useSentRequests } from "../../../../hooks";
import { DeleteConfirmDialog } from "../../../../components/dialogs/DeleteConfirmDialog";
import { SentRequestCard } from "../../../../components/cards";

const SentRequestsTab: React.FC = () => {
  const {
    sentRequests,
    isCancelDialogOpen,
    onCancelDialogClose,
    handleCancelClick,
    handleCancel,
  } = useSentRequests();

  return (
    <Box>
      {sentRequests.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">
            You haven't sent any friend requests.
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {sentRequests.map((request) => (
            <SentRequestCard
              key={request.id}
              request={request}
              onCancel={handleCancelClick}
            />
          ))}
        </VStack>
      )}

      <DeleteConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={onCancelDialogClose}
        onConfirm={handleCancel}
        title="Cancel Friend Request"
        message="Are you sure you want to cancel this friend request?"
      />
    </Box>
  );
};

export default SentRequestsTab;

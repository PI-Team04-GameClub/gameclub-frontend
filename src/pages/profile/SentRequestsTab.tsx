import React from "react";
import {
  Box,
  Card,
  CardBody,
  VStack,
  Text,
  Avatar,
  Button,
  Flex,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useSentRequests } from "../../hooks";
import { DeleteConfirmDialog } from "../../components/dialogs/DeleteConfirmDialog";
import { FriendRequest } from "../../types";

const SentRequestCard: React.FC<{
  request: FriendRequest;
  onCancel: (id: number) => void;
}> = ({ request, onCancel }) => {
  return (
    <Card
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
      transition="all 0.3s"
    >
      <CardBody>
        <Flex align="center" justify="space-between">
          <HStack spacing={4}>
            <Avatar
              size="md"
              name={`${request.receiverFirstName} ${request.receiverLastName}`}
              src={`https://i.pravatar.cc/150?u=${request.receiverId}`}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="600">
                {request.receiverFirstName} {request.receiverLastName}
              </Text>
              <Text color="gray.500" fontSize="sm">
                {request.receiverEmail}
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={3}>
            <Badge colorScheme="yellow">Pending</Badge>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => onCancel(request.id)}
            >
              Cancel
            </Button>
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};

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

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
  HStack,
} from "@chakra-ui/react";
import { useReceivedRequests } from "../../hooks";
import { FriendRequest } from "../../types";

const ReceivedRequestCard: React.FC<{
  request: FriendRequest;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}> = ({ request, onAccept, onReject }) => {
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
              name={`${request.senderFirstName} ${request.senderLastName}`}
              src={`https://i.pravatar.cc/150?u=${request.senderId}`}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="600">
                {request.senderFirstName} {request.senderLastName}
              </Text>
              <Text color="gray.500" fontSize="sm">
                {request.senderEmail}
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => onAccept(request.id)}
            >
              Accept
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => onReject(request.id)}
            >
              Reject
            </Button>
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};

const ReceivedRequestsTab: React.FC = () => {
  const { receivedRequests, handleAccept, handleReject } = useReceivedRequests();

  return (
    <Box>
      {receivedRequests.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">
            You don't have any pending friend requests.
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {receivedRequests.map((request) => (
            <ReceivedRequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ReceivedRequestsTab;

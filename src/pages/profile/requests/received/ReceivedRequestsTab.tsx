import React from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { useReceivedRequests } from "../../../../hooks";
import { ReceivedRequestCard } from "../../../../components/cards";

const ReceivedRequestsTab: React.FC = () => {
  const { receivedRequests, handleAccept, handleReject } =
    useReceivedRequests();

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

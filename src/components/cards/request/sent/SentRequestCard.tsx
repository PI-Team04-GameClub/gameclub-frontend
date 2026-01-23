import React from "react";
import {
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
import { FriendRequest } from "../../../../types";

interface SentRequestCardProps {
  request: FriendRequest;
  onCancel: (id: number) => void;
}

const SentRequestCard: React.FC<SentRequestCardProps> = ({
  request,
  onCancel,
}) => {
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

export default SentRequestCard;

import React from "react";
import {
  Card,
  CardBody,
  VStack,
  Text,
  Avatar,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Friend } from "../../../types";

interface FriendCardProps {
  friend: Friend;
  onRemove: (id: number) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onRemove }) => {
  return (
    <Card
      _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
      transition="all 0.3s"
    >
      <CardBody>
        <Flex direction="column" align="center" gap={4}>
          <Avatar
            size="xl"
            name={`${friend.firstName} ${friend.lastName}`}
            src={`https://i.pravatar.cc/150?u=${friend.id}`}
          />
          <VStack spacing={1}>
            <Text fontWeight="700" fontSize="lg">
              {friend.firstName} {friend.lastName}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {friend.email}
            </Text>
          </VStack>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={() => onRemove(friend.id)}
          >
            Remove Friend
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default FriendCard;

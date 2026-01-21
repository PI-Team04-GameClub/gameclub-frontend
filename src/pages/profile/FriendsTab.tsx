import React from "react";
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  Text,
  Avatar,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useFriends } from "../../hooks";
import { DeleteConfirmDialog } from "../../components/dialogs/DeleteConfirmDialog";
import { Friend } from "../../types";

const FriendCard: React.FC<{
  friend: Friend;
  onRemove: (id: number) => void;
}> = ({ friend, onRemove }) => {
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

const FriendsTab: React.FC = () => {
  const {
    friends,
    isDeleteDialogOpen,
    onDeleteDialogClose,
    handleRemoveClick,
    handleRemove,
  } = useFriends();

  return (
    <Box>
      {friends.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500" fontSize="lg">
            You don't have any friends yet.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onRemove={handleRemoveClick}
            />
          ))}
        </SimpleGrid>
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleRemove}
        title="Remove Friend"
        message="Are you sure you want to remove this friend? This action cannot be undone."
      />
    </Box>
  );
};

export default FriendsTab;

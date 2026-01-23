import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useFriends } from "../../../hooks";
import { DeleteConfirmDialog } from "../../../components/dialogs/DeleteConfirmDialog";
import { FriendCard } from "../../../components/cards";

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

import { useState, useEffect, useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { profileService } from "../../services/profile_service";
import { Friend } from "../../types";

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendToRemove, setFriendToRemove] = useState<number | null>(null);

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const loadFriends = useCallback(async () => {
    try {
      const data = await profileService.getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleRemoveClick = useCallback(
    (id: number) => {
      setFriendToRemove(id);
      onDeleteDialogOpen();
    },
    [onDeleteDialogOpen],
  );

  const handleRemove = useCallback(async () => {
    if (friendToRemove) {
      try {
        await profileService.removeFriend(friendToRemove);
        loadFriends();
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    }
  }, [friendToRemove, loadFriends]);

  return {
    friends,
    isDeleteDialogOpen,
    onDeleteDialogClose,
    handleRemoveClick,
    handleRemove,
  };
};

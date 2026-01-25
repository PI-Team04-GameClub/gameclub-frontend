import { useState, useEffect, useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { friendRequestService } from "../../../services/friend_request_service";
import { authService } from "../../../services/auth_service";
import { Friend } from "../../../types";

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
      const user = authService.getUser();
      if (!user) return;
      const data = await friendRequestService.getFriends(user.id);
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
    [onDeleteDialogOpen]
  );

  const handleRemove = useCallback(async () => {
    if (friendToRemove) {
      try {
        await friendRequestService.cancelRequest(friendToRemove);
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

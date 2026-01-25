import { useState, useEffect, useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { friendRequestService } from "../../../../services/friend_request_service";
import { authService } from "../../../../services/auth_service";
import { FriendRequest } from "../../../../types";

export const useSentRequests = () => {
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [requestToCancel, setRequestToCancel] = useState<number | null>(null);

  const {
    isOpen: isCancelDialogOpen,
    onOpen: onCancelDialogOpen,
    onClose: onCancelDialogClose,
  } = useDisclosure();

  const loadSentRequests = useCallback(async () => {
    try {
      const user = authService.getUser();
      if (!user) return;
      const data = await friendRequestService.getSentRequests(user.id);
      setSentRequests(data);
    } catch (error) {
      console.error("Error loading sent requests:", error);
    }
  }, []);

  useEffect(() => {
    loadSentRequests();
  }, [loadSentRequests]);

  const handleCancelClick = useCallback(
    (id: number) => {
      setRequestToCancel(id);
      onCancelDialogOpen();
    },
    [onCancelDialogOpen]
  );

  const handleCancel = useCallback(async () => {
    if (requestToCancel) {
      try {
        await friendRequestService.cancelRequest(requestToCancel);
        loadSentRequests();
      } catch (error) {
        console.error("Error canceling request:", error);
      }
    }
  }, [requestToCancel, loadSentRequests]);

  return {
    sentRequests,
    isCancelDialogOpen,
    onCancelDialogClose,
    handleCancelClick,
    handleCancel,
  };
};

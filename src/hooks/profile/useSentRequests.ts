import { useState, useEffect, useCallback } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { profileService } from "../../services/profile_service";
import { FriendRequest } from "../../types";

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
      const data = await profileService.getSentRequests();
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
        await profileService.cancelRequest(requestToCancel);
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

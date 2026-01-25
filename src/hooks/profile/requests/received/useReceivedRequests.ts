import { useState, useEffect, useCallback } from "react";
import { friendRequestService } from "../../../../services/friend_request_service";
import { authService } from "../../../../services/auth_service";
import { FriendRequest } from "../../../../types";

export const useReceivedRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);

  const loadReceivedRequests = useCallback(async () => {
    try {
      const user = authService.getUser();
      if (!user) return;
      const data = await friendRequestService.getReceivedRequests(user.id);
      setReceivedRequests(data);
    } catch (error) {
      console.error("Error loading received requests:", error);
    }
  }, []);

  useEffect(() => {
    loadReceivedRequests();
  }, [loadReceivedRequests]);

  const handleAccept = useCallback(
    async (id: number) => {
      try {
        await friendRequestService.acceptRequest(id);
        loadReceivedRequests();
      } catch (error) {
        console.error("Error accepting request:", error);
      }
    },
    [loadReceivedRequests]
  );

  const handleReject = useCallback(
    async (id: number) => {
      try {
        await friendRequestService.rejectRequest(id);
        loadReceivedRequests();
      } catch (error) {
        console.error("Error rejecting request:", error);
      }
    },
    [loadReceivedRequests]
  );

  return {
    receivedRequests,
    handleAccept,
    handleReject,
  };
};

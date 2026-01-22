import { useState, useEffect, useCallback } from "react";
import { profileService } from "../../services/profile_service";
import { FriendRequest } from "../../types";

export const useReceivedRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);

  const loadReceivedRequests = useCallback(async () => {
    try {
      const data = await profileService.getReceivedRequests();
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
        await profileService.acceptRequest(id);
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
        await profileService.rejectRequest(id);
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

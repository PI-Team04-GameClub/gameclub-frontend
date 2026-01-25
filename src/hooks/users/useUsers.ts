import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { userService } from "../../services/user_service";
import { friendRequestService } from "../../services/friend_request_service";
import { authService } from "../../services/auth_service";
import { User } from "../../types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRequests, setPendingRequests] = useState<Set<number>>(
    new Set()
  );
  const [existingFriends, setExistingFriends] = useState<Set<number>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = authService.getUser();
      if (!currentUser) return;

      const [allUsers, sentRequests, friends] = await Promise.all([
        userService.getAllUsers(),
        friendRequestService.getSentRequests(currentUser.id),
        friendRequestService.getFriends(currentUser.id),
      ]);

      // Exclude current user from the list
      const filteredUsers = allUsers.filter(
        (user) => user.id !== currentUser.id
      );
      setUsers(filteredUsers);

      // Get pending request receiver IDs
      const pendingIds = new Set(
        sentRequests
          .filter((req) => req.status === "pending")
          .map((req) => req.receiverId)
      );
      setPendingRequests(pendingIds);

      // Get friend IDs
      const friendIds = new Set(friends.map((friend) => friend.friendId));
      setExistingFriends(friendIds);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      const firstName = user.first_name.toLowerCase();
      const lastName = user.last_name.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const email = user.email.toLowerCase();

      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        fullName.includes(query) ||
        email.includes(query)
      );
    });
  }, [users, searchQuery]);

  const handleAddFriend = useCallback(
    async (userId: number) => {
      try {
        await friendRequestService.sendFriendRequest({ receiverId: userId });
        setPendingRequests((prev) => new Set([...prev, userId]));
        toast({
          title: "Friend request sent",
          description: "Your friend request has been sent successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error sending friend request:", error);
        toast({
          title: "Error",
          description: "Failed to send friend request. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    handleAddFriend,
    pendingRequests,
    existingFriends,
    isLoading,
  };
};

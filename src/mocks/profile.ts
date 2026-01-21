import { Friend, FriendRequest } from "../types";

export interface ProfileStats {
  totalWins: number;
  totalGames: number;
  winRate: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
}

export const mockProfileStats: ProfileStats = {
  totalWins: 42,
  totalGames: 78,
  winRate: 53.8,
  tournamentsPlayed: 15,
  tournamentsWon: 3,
};

export const mockFriends: Friend[] = [
  {
    id: 1,
    userId: 1,
    friendId: 2,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    userId: 1,
    friendId: 3,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    createdAt: "2024-02-20T14:45:00Z",
  },
  {
    id: 3,
    userId: 1,
    friendId: 4,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    createdAt: "2024-03-10T09:15:00Z",
  },
  {
    id: 4,
    userId: 1,
    friendId: 5,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    createdAt: "2024-03-25T16:20:00Z",
  },
];

export const mockSentRequests: FriendRequest[] = [
  {
    id: 1,
    senderId: 1,
    receiverId: 6,
    senderFirstName: "Current",
    senderLastName: "User",
    senderEmail: "current.user@example.com",
    receiverFirstName: "Alex",
    receiverLastName: "Brown",
    receiverEmail: "alex.brown@example.com",
    status: "pending",
    createdAt: "2024-04-01T11:00:00Z",
  },
  {
    id: 2,
    senderId: 1,
    receiverId: 7,
    senderFirstName: "Current",
    senderLastName: "User",
    senderEmail: "current.user@example.com",
    receiverFirstName: "Emily",
    receiverLastName: "Davis",
    receiverEmail: "emily.davis@example.com",
    status: "pending",
    createdAt: "2024-04-02T15:30:00Z",
  },
];

export const mockReceivedRequests: FriendRequest[] = [
  {
    id: 3,
    senderId: 8,
    receiverId: 1,
    senderFirstName: "Chris",
    senderLastName: "Wilson",
    senderEmail: "chris.wilson@example.com",
    receiverFirstName: "Current",
    receiverLastName: "User",
    receiverEmail: "current.user@example.com",
    status: "pending",
    createdAt: "2024-04-03T09:45:00Z",
  },
  {
    id: 4,
    senderId: 9,
    receiverId: 1,
    senderFirstName: "Lisa",
    senderLastName: "Anderson",
    senderEmail: "lisa.anderson@example.com",
    receiverFirstName: "Current",
    receiverLastName: "User",
    receiverEmail: "current.user@example.com",
    status: "pending",
    createdAt: "2024-04-04T13:15:00Z",
  },
];

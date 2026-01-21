export interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverEmail: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface FriendRequestFormData {
  receiverId: number;
}

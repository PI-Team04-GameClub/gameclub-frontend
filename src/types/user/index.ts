export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface Friend {
  id: number;
  userId: number;
  friendId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

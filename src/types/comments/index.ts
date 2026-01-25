export interface Comment {
  id: number;
  content: string;
  user_id: number;
  user_name: string;
  news_id: number;
  news_title: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
  user_id: number;
  news_id: number;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Comment {
  _id: string;
  id?: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment?: string | null;
  likes?: string[];
  likesCount?: number;
  repliesCount?: number;
  createdAt: string;
  isReply?: boolean;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: { comments: Comment[] };
  meta?: { pagination: any };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: { comment: Comment };
}
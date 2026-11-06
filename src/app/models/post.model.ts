export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

import { Comment } from './comment.model';

export interface Post {
  _id: string;
  id?: string;
  body: string;
  image?: string;
  privacy?: string;
  user: PostUser | string;
  sharedPost?: Post | null;
  likes?: string[];
  likesCount?: number;
  commentsCount?: number;
  topComment?: Comment | null;
  sharesCount?: number;
  isShare?: boolean;
  bookmarked?: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  numberOfPages?: number;
  limit: number;
  total?: number;
  nextPage?: number;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: { posts: Post[] };
  meta?: { pagination: PaginationMeta; feedMode?: string };
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: { post: Post };
}
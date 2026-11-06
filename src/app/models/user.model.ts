export interface User {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email?: string;
  photo: string;
  cover?: string;
  dateOfBirth?: string;
  gender?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: string;
    user?: User;
  };
}
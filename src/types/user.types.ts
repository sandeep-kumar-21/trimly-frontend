export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export type Role = 'Owner' | 'Admin' | 'Manager' | 'Clerk' | 'Viewer';

export type User = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
};

export type Session = {
  accessToken: string;
  refreshToken?: string | null;
  user: User;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string | null;
  user: User;
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string; 
  user: User;
}

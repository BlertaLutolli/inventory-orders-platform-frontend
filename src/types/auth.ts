export type Role = 'Admin' | 'Clerk' | 'Viewer';

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
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string | null;
  user: User;
};

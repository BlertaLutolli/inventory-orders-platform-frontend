import api from "../api"; // axios instance from src/api.ts
import { LoginRequest, LoginResponse, User } from "../types/auth";

export const authApi = {
  async login(body: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", body);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/api/auth/me");
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore if backend doesn't implement /logout
    }
  }
};

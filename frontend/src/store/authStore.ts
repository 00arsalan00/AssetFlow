import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "Admin" | "Asset Manager" | "Department Head" | "Employee";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

// Role map for demo quick-login
export const DEMO_USERS: Record<string, AuthUser> = {
  "admin@assetflow.io": {
    id: "demo-1",
    name: "Alex Admin",
    email: "admin@assetflow.io",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?u=admin",
  },
  "manager@assetflow.io": {
    id: "demo-2",
    name: "Maria Manager",
    email: "manager@assetflow.io",
    role: "Asset Manager",
    avatar: "https://i.pravatar.cc/150?u=manager",
  },
  "emp@assetflow.io": {
    id: "demo-3",
    name: "Ethan Employee",
    email: "emp@assetflow.io",
    role: "Employee",
    avatar: "https://i.pravatar.cc/150?u=employee",
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "assetflow-auth",
    }
  )
);

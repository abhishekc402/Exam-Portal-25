import { create } from 'zustand';

type UserRole = 'admin' | 'teacher' | 'student';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    role: UserRole;
  } | null;
  login: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (username, password, role) => {
    // In production, this would make an API call
    if (role === 'admin' && username === 'admin' && password === 'admin') {
      set({ isAuthenticated: true, user: { name: username, role } });
    } else if (password === 'password') {
      set({ isAuthenticated: true, user: { name: username, role } });
    }
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
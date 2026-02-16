import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/models/domain';
import ServiceAuth from '@/services/ServiceAuth';
import ServiceUsers from '@/services/ServiceUsers';
import Backend from '@/services/Backend';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingEmail: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPendingEmail: (email: string | null) => void;

  login: (username: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  verify: (code: string) => Promise<boolean>;
  resendCode: () => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  fetchCurrentUser: () => Promise<void>;
  checkAuth: () => void;
}

const useStoreAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingEmail: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setPendingEmail: (pendingEmail) => set({ pendingEmail }),

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await ServiceAuth.login({ username, password });
          if (result.success && result.data) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
              pendingEmail: result.data.user.email,
            });
            return true;
          }
          set({ error: result.message || 'Login failed', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await ServiceAuth.register({ firstName, lastName, email, password });
          if (result.success) {
            set({ pendingEmail: email, isLoading: false });
            return true;
          }
          set({ error: result.message || 'Registration failed', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      verify: async (code) => {
        const { pendingEmail } = get();
        if (!pendingEmail) {
          set({ error: 'No email pending verification' });
          return false;
        }
        set({ isLoading: true, error: null });
        try {
          const result = await ServiceAuth.verify({ code, email: pendingEmail });
          if (result.success && result.data) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
              pendingEmail: null,
            });
            return true;
          }
          set({ error: result.message || 'Verification failed', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Verification failed',
            isLoading: false,
          });
          return false;
        }
      },

      resendCode: async () => {
        const { pendingEmail } = get();
        if (!pendingEmail) return false;
        try {
          const result = await ServiceAuth.resendCode(pendingEmail);
          return result.success === true;
        } catch {
          return false;
        }
      },

      loginAsGuest: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await ServiceAuth.loginAsGuest();
          if (result.success && result.data) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
          set({ error: 'Guest login failed', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Guest login failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await ServiceAuth.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            pendingEmail: null,
            error: null,
          });
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const result = await ServiceAuth.changePassword({ currentPassword, newPassword });
          set({ isLoading: false });
          if (!result.success) {
            set({ error: result.message || 'Password change failed' });
          }
          return result.success === true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Password change failed',
            isLoading: false,
          });
          return false;
        }
      },

      fetchCurrentUser: async () => {
        try {
          const user = await ServiceUsers.getMe();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
          Backend.clearTokens();
        }
      },

      checkAuth: () => {
        const hasToken = Backend.isAuthenticated();
        if (!hasToken) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'gastos-app-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
);

export default useStoreAuth;

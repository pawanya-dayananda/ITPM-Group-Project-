import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      userId: null,
      
      // Login user
      login: async (email, password) => {
        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true,
            userId: data.user.id
          });

          return { success: true, user: data.user };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Register user
      register: async (name, email, password) => {
        try {
          const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }

          return { success: true, message: data.message };
        } catch (error) {
          return { success: false, message: error.message };
        }
      },

      // Logout user
      logout: async () => {
        try {
          await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
          });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ user: null, token: null, isAuthenticated: false, userId: null });
        }
      },

      // Initialize user from stored data
      initializeUser: () => {
        const state = get();
        if (state.user && state.user.id) {
          set({ userId: state.user.id });
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const state = useUserStore.getState();
        return state.user?.role === "admin";
      },
    }),
    {
      name: "user-storage",
    }
  )
);

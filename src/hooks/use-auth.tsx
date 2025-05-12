import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/services/firebase";
import { create } from "zustand";

interface AuthState {
  user: FirebaseUser | null | undefined;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Set up the auth state listener once
  if (typeof window !== "undefined") {
    onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser, loading: false });
    });
  }

  return {
    user: undefined,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    logout: async () => {
      await auth.signOut();
    },
  };
}); 
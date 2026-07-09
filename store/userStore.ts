import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  session: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),
  setSession: (session) => set({ session, user: session?.user ?? null, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, session: null, loading: false }),
}));

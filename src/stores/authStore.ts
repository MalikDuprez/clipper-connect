import { create } from "zustand";
import { supabase } from "@lib/supabase";

type UserRole = "client" | "coiffeur" | "salon" | null;

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
}

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setRole: (role: UserRole) => Promise<{ error: string | null }>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),

  signUp: async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: null,
        });
        if (profileError) return { error: profileError.message };
        set({
          user: { id: data.user.id, email, full_name: fullName, avatar_url: null, phone: null, role: null },
          isAuthenticated: true,
          isLoading: false,
        });
      }
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) await get().fetchProfile();
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  setRole: async (role) => {
    const { user } = get();
    if (!user) return { error: "Non connecte" };
    try {
      const { error } = await supabase.from("profiles").update({ role }).eq("id", user.id);
      if (error) return { error: error.message };

      // Si coiffeur, creer l'entree dans la table coiffeurs
      if (role === "coiffeur") {
        // Verifier si existe deja
        const { data: existing } = await supabase
          .from("coiffeurs")
          .select("id")
          .eq("profile_id", user.id)
          .single();

        if (!existing) {
          const { error: coiffeurError } = await supabase.from("coiffeurs").insert({
            profile_id: user.id,
            specialty: null,
            bio: null,
            hourly_rate: null,
          });
          if (coiffeurError) console.error("Erreur creation coiffeur:", coiffeurError);
        }
      }

      // Si salon, creer l'entree dans la table salons
      if (role === "salon") {
        const { data: existing } = await supabase
          .from("salons")
          .select("id")
          .eq("profile_id", user.id)
          .single();

        if (!existing) {
          await supabase.from("salons").insert({
            profile_id: user.id,
            name: user.full_name || "Mon Salon",
          });
        }
      }

      set({ user: { ...user, role } });
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  fetchProfile: async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { set({ user: null, isAuthenticated: false, isLoading: false }); return; }
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      if (error || !profile) { set({ user: null, isAuthenticated: false, isLoading: false }); return; }
      set({
        user: { id: profile.id, email: profile.email, full_name: profile.full_name, avatar_url: profile.avatar_url, phone: profile.phone, role: profile.role },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (e) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "black";
export type ColorPreset = "blush" | "mint" | "lilac" | "sky" | "peach" | "neutral";

export type AvatarId = "avatar1" | "avatar2" | "avatar3" | "avatar4";

export interface UserProfile {
  name: string;
  avatar: AvatarId;
}

export interface ThemeState {
  mode: ThemeMode;
  preset: ColorPreset;
  budget: number;
  userProfile: UserProfile;
  setMode: (mode: ThemeMode) => void;
  setPreset: (preset: ColorPreset) => void;
  setBudget: (budget: number) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
}

export const PRESET_LABELS: Record<ColorPreset, string> = {
  blush: "Blush",
  mint: "Mint",
  lilac: "Lilac",
  sky: "Sky",
  peach: "Peach",
  neutral: "Neutral",
};

export const PRESET_COLORS: Record<ColorPreset, string> = {
  blush: "#f4a7bb",
  mint: "#98d4bb",
  lilac: "#c3a6d8",
  sky: "#8ec5e8",
  peach: "#f7c59f",
  neutral: "#b0aeab",
};

export const MODE_LABELS: Record<ThemeMode, string> = {
  light: "Claro",
  dark: "Oscuro",
  black: "Negro total",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage may be full or unavailable (private browsing)
    }
  }
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: load<ThemeMode>("maak-theme-mode", "dark"),
  preset: load<ColorPreset>("maak-color-preset", "blush"),
  budget: load<number>("maak-budget", 1500000),
  userProfile: load<UserProfile>("maak-user-profile", {
    name: "Administradora",
    avatar: "avatar1",
  }),

  setMode: (mode) => {
    save("maak-theme-mode", mode);
    set({ mode });
  },

  setPreset: (preset) => {
    save("maak-color-preset", preset);
    set({ preset });
  },

  setBudget: (budget) => {
    save("maak-budget", budget);
    set({ budget });
  },

  setUserProfile: (partial) =>
    set((state) => {
      const updated = { ...state.userProfile, ...partial };
      save("maak-user-profile", updated);
      return { userProfile: updated };
    }),
}));

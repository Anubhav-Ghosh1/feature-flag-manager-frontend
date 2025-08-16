import { create } from "zustand";

export interface ContextStore {
  theme: string;

  setField: <T extends keyof ContextStore>(
    key: T,
    value: ContextStore[T]
  ) => void;
  toggleTheme: (tech: string) => void;
}

export const useContextStore = create<ContextStore>((set) => ({
  theme: "light",
  setField: (key, value) => set({ [key]: value }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));

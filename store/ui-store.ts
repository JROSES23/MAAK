'use client';

import { create } from 'zustand';
import { PaletteKey, VisualMode } from '@/lib/theme';

type UiState = {
  mode: VisualMode;
  palette: PaletteKey;
  setMode: (mode: VisualMode) => void;
  setPalette: (palette: PaletteKey) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mode: 'crystal',
  palette: 'blue-violet',
  setMode: (mode) => set({ mode }),
  setPalette: (palette) => set({ palette })
}));

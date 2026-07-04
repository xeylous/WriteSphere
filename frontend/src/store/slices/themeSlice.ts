import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
}

const initialState: ThemeState = {
  mode: 'system',
  resolved: 'dark',
};

/**
 * Theme slice managing dark/light/system mode.
 * Persists to localStorage for guests, syncs with API for logged-in users.
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    setResolvedTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.resolved = action.payload;
    },
    initializeTheme(state) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme') as ThemeMode | null;
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          state.mode = stored;
        }
      }
    },
  },
});

export const { setThemeMode, setResolvedTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;

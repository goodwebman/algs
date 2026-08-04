import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  /** Черновики решений: slug задачи → код. */
  drafts: Record<string, string>;
  /** Слаги задач, где все тесты прошли. */
  solved: string[];
  /** Слаги прочитанных разборов. */
  read: string[];
  saveDraft: (slug: string, code: string) => void;
  clearDraft: (slug: string) => void;
  markSolved: (slug: string) => void;
  markRead: (slug: string) => void;
  resetAll: () => void;
}

/**
 * Прогресс и черновики кода в localStorage.
 *
 * Черновики важнее прогресса: потерять на перезагрузке решение, которое
 * писал двадцать минут, — верный способ закрыть вкладку навсегда.
 */
export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      drafts: {},
      solved: [],
      read: [],

      saveDraft: (slug, code) => set((state) => ({ drafts: { ...state.drafts, [slug]: code } })),

      clearDraft: (slug) =>
        set((state) => {
          const drafts = { ...state.drafts };
          delete drafts[slug];
          return { drafts };
        }),

      markSolved: (slug) =>
        set((state) => (state.solved.includes(slug) ? state : { solved: [...state.solved, slug] })),

      markRead: (slug) =>
        set((state) => (state.read.includes(slug) ? state : { read: [...state.read, slug] })),

      resetAll: () => set({ drafts: {}, solved: [], read: [] }),
    }),
    { name: 'algs-book-progress', version: 1 },
  ),
);

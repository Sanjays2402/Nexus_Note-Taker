import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useStore = create(
  persist(
    (set, get) => ({
      notes: {},
      settings: {
        theme: 'dark',
        fontSize: 14,
        claudeApiKey: '',
      },
      activeNoteId: null,

      // Settings actions
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      // Note actions
      setActiveNoteId: (id) => set({ activeNoteId: id }),

      createNote: () => {
        const id = uuidv4();
        const now = Date.now();
        const newNote = {
          id,
          title: 'Untitled Note',
          content: '',
          created: now,
          modified: now,
          tags: [],
          links: [],
        };
        
        set((state) => ({
          notes: { ...state.notes, [id]: newNote },
          activeNoteId: id,
        }));
        
        return id;
      },

      updateNote: (id, updates) => {
        set((state) => {
          if (!state.notes[id]) return state;
          
          return {
            notes: {
              ...state.notes,
              [id]: {
                ...state.notes[id],
                ...updates,
                modified: Date.now(),
              },
            },
          };
        });
      },

      deleteNote: (id) => {
        set((state) => {
          const { [id]: deletedNote, ...remainingNotes } = state.notes;
          return {
            notes: remainingNotes,
            activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
          };
        });
      },

      getNote: (id) => get().notes[id],
      
      getAllNotes: () => Object.values(get().notes).sort((a, b) => b.modified - a.modified),
    }),
    {
      name: 'nexus_notes',
      partialize: (state) => ({ notes: state.notes, settings: state.settings }), // Persist only notes and settings
    }
  )
);

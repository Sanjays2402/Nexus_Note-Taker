import React, { useEffect, useState, useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { autocompletion } from '@codemirror/autocomplete';
import { useStore } from '../store/notesStore';

export default function Editor() {
  const { activeNoteId, notes, updateNote, settings, getAllNotes } = useStore();
  const currentNote = activeNoteId ? notes[activeNoteId] : null;
  
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const notesList = getAllNotes();

  // Sync local state when active note changes
  useEffect(() => {
    if (currentNote) {
      setLocalTitle(currentNote.title);
      setLocalContent(currentNote.content);
    }
  }, [activeNoteId, currentNote?.id]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    updateNote(activeNoteId, { title: newTitle });
  };

  // Debounced auto-save for content
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentNote && localContent !== currentNote.content) {
        updateNote(activeNoteId, { content: localContent });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localContent, activeNoteId, updateNote, currentNote]);

  const handleContentChange = useCallback((val) => {
    setLocalContent(val);
  }, []);

  const myCompletions = useCallback((context) => {
    let word = context.matchBefore(/\[\[([^\]]*)/);
    if (!word) return null;
    if (word.from === word.to && !context.explicit) return null;
    
    return {
      from: word.from + 2,
      options: notesList.map(n => ({
        label: n.title,
        type: "keyword",
        apply: `${n.title}]]`
      }))
    };
  }, [notesList]);

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage }),
    autocompletion({ override: [myCompletions] })
  ], [myCompletions]);

  if (!currentNote) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-editor border-r border-gray-800/40">
      <div className="px-10 pt-12 pb-6 max-w-4xl mx-auto w-full">
        <input 
          type="text" 
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="w-full bg-transparent text-5xl font-extrabold tracking-tight text-text-primary outline-none placeholder-gray-600/50"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-10 max-w-4xl w-full mx-auto pb-10">
        <CodeMirror
          value={localContent}
          theme={settings.theme === 'dark' ? 'dark' : 'light'}
          extensions={extensions}
          onChange={handleContentChange}
          className="h-full text-lg w-full"
          style={{ fontSize: `${settings.fontSize}px` }}
        />
      </div>
      
      {/* Status bar */}
      <div className="p-3 px-6 border-t border-gray-800/40 text-xs font-medium text-gray-500 flex items-center justify-between bg-dark-bg">
        <div className="flex gap-4">
          <span>{localContent.trim() ? localContent.trim().split(/\s+/).length : 0} words</span>
          <span>{localContent.length} characters</span>
        </div>
        <span>Last edited: {new Date(currentNote.modified).toLocaleString()}</span>
      </div>
    </div>
  );
}

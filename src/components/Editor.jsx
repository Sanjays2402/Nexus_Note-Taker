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
    <div className="flex-1 flex flex-col h-full bg-dark-editor border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <input 
          type="text" 
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full bg-transparent text-2xl font-bold text-text-primary outline-none placeholder-gray-600"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-editor">
        <CodeMirror
          value={localContent}
          height="100%"
          theme={settings.theme === 'dark' ? 'dark' : 'light'}
          extensions={extensions}
          onChange={handleContentChange}
          className="h-full text-lg"
          style={{ fontSize: `${settings.fontSize}px` }}
        />
      </div>
      
      {/* Status bar */}
      <div className="p-2 px-4 border-t border-gray-800 text-xs text-gray-500 flex items-center justify-between">
        <span>{localContent.trim() ? localContent.trim().split(/\s+/).length : 0} words</span>
        <span>Last edited: {new Date(currentNote.modified).toLocaleString()}</span>
      </div>
    </div>
  );
}

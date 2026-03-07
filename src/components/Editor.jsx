import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { autocompletion } from '@codemirror/autocomplete';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Code } from 'lucide-react';
import { useStore } from '../store/notesStore';

export default function Editor() {
  const { activeNoteId, notes, updateNote, settings, getAllNotes } = useStore();
  const currentNote = activeNoteId ? notes[activeNoteId] : null;
  const editorRef = useRef(null);
  
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

  const insertFormatting = (prefix, suffix = '') => {
    if (editorRef.current?.view) {
      const view = editorRef.current.view;
      const { state } = view;
      const selection = state.selection.main;
      const selectedText = state.doc.sliceString(selection.from, selection.to);
      const isLineStart = prefix === '- ' || prefix === '1. ';
      
      let insertText = `${prefix}${selectedText}${suffix}`;
      let anchorOffset = selection.from + prefix.length;
      let headOffset = selection.to + prefix.length;

      if (selection.empty && suffix) {
        const placeholder = prefix === '**' ? 'bold text' : prefix === '*' ? 'italic text' : prefix === '`' ? 'code' : 'text';
        insertText = `${prefix}${placeholder}${suffix}`;
        anchorOffset = selection.from + prefix.length;
        headOffset = selection.from + prefix.length + placeholder.length;
      }

      if (isLineStart) {
        const line = state.doc.lineAt(selection.from);
        if (line.text.startsWith(prefix)) {
          // Remove prefix if it already exists
          view.dispatch({
            changes: { from: line.from, to: line.from + prefix.length, insert: '' }
          });
          view.focus();
          return;
        } else {
          insertText = prefix;
          anchorOffset = selection.from + prefix.length;
          headOffset = selection.to + prefix.length;
          view.dispatch({
            changes: { from: line.from, to: line.from, insert: insertText },
          });
          view.focus();
          return;
        }
      }

      view.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: insertText
        },
        selection: { anchor: anchorOffset, head: headOffset }
      });
      view.focus();
    } else {
      setLocalContent(prev => prev + '\n' + prefix + suffix);
    }
  };

  if (!currentNote) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-editor relative border-r border-white/5">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 w-full pt-20 pb-4">
          <input
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            className="w-full bg-transparent text-4xl font-semibold tracking-tight text-text-primary outline-none placeholder-gray-700 mb-8"
          />
          <CodeMirror
            ref={editorRef}
            value={localContent}
            theme={settings.theme === 'dark' ? 'dark' : 'light'}
            extensions={extensions}
            onChange={handleContentChange}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              history: true,
            }}
            className="text-lg w-full min-h-[50vh]"
            style={{ fontSize: `${settings.fontSize}px` }}
          />
        </div>
      </div>

      {/* Floating Status pill */}
      <div className="absolute bottom-6 right-8 px-4 py-2 rounded-full border border-white/5 bg-[#141414]/90 backdrop-blur-xl text-[11px] text-text-muted flex items-center gap-4 shadow-2xl z-10 hidden sm:flex">
        
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-2 mr-2 pr-4 border-r border-white/10">
          <button onClick={() => insertFormatting('**', '**')} className="hover:text-white transition-colors" title="Bold">
            <Bold size={14} />
          </button>
          <button onClick={() => insertFormatting('*', '*')} className="hover:text-white transition-colors" title="Italic">
            <Italic size={14} />
          </button>
          <button onClick={() => insertFormatting('- ')} className="hover:text-white transition-colors" title="Bullet List">
            <List size={14} />
          </button>
          <button onClick={() => insertFormatting('1. ')} className="hover:text-white transition-colors" title="Numbered List">
            <ListOrdered size={14} />
          </button>
          <button onClick={() => insertFormatting('`', '`')} className="hover:text-white transition-colors" title="Code">
            <Code size={14} />
          </button>
        </div>

        <span>{localContent.trim() ? localContent.trim().split(/\s+/).length : 0} words</span>
        <span>{localContent.length} chars</span>
        <div className="w-[1px] h-3 bg-white/10"></div>
        <span>Edited {new Date(currentNote.modified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}

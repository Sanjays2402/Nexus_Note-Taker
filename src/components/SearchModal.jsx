import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/notesStore';
import { Search, FileText } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { getAllNotes, setActiveNoteId } = useStore();
  const notes = getAllNotes();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === '' ? [] : notes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) || 
    note.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div 
        className="bg-dark-sidebar border border-gray-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes by title or content..."
            className="flex-1 bg-transparent text-lg text-text-primary outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">ESC to close</div>
        </div>

        {query.trim() !== '' && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No results found for "{query}"</div>
            ) : (
              results.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    onClose();
                  }}
                  className="p-3 hover:bg-brand-600/20 hover:border-brand-500/50 border border-transparent rounded-lg cursor-pointer transition-colors flex gap-3 text-left"
                >
                  <FileText className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <div className="text-text-primary font-medium">{note.title || 'Untitled'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xl">
                      {note.content.replace(/[#*`_\[\]>]/g, '').substring(0, 100) || 'No content...'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className="bg-[#111] border border-white/10 w-full max-w-xl rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search size={16} className="text-white/40" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes..."
            className="flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder-white/30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded font-mono">ESC</div>
        </div>

        {query.trim() !== '' && (
          <div className="max-h-[50vh] overflow-y-auto p-1.5">
            {results.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-white/30">No results found for "{query}"</div>
            ) : (
              results.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    onClose();
                  }}
                  className="px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors flex gap-3 text-left items-center group"
                >
                  <FileText className="text-white/20 group-hover:text-white/50 shrink-0" size={15} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[#eee] font-medium text-[13px]">{note.title || 'Untitled Note'}</div>
                    <div className="text-[12px] text-white/30 truncate mt-0.5">
                      {note.content.replace(/[#*`_\[\]>]/g, '').substring(0, 100) || 'No content'}
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

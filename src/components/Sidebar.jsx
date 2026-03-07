import { useStore } from '../store/notesStore';
import { Plus, Trash2, FileText, Search, Network, Sparkles, Settings } from 'lucide-react';

export default function Sidebar({ onSearchClick, onGraphClick, onAIClick, onSettingsClick }) {
  const { activeNoteId, createNote, setActiveNoteId, deleteNote, getAllNotes } = useStore();
  const notesList = getAllNotes();

  return (
    <div className="w-64 bg-dark-sidebar border-r border-gray-800 h-full flex flex-col shrink-0">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="font-bold text-text-primary">Nexus Notes</h1>
        <div className="flex gap-1">
          <button onClick={onSearchClick} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Search (Cmd+K)">
            <Search size={16} />
          </button>
          <button onClick={onGraphClick} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Graph View (Cmd+G)">
            <Network size={16} />
          </button>
          <button onClick={onAIClick} className="p-1.5 text-gray-400 hover:text-brand-400 hover:bg-gray-800 rounded transition-colors" title="AI Chat (Cmd+/)">
            <Sparkles size={16} />
          </button>
          <button onClick={onSettingsClick} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={createNote}
          className="w-full py-2 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-md flex items-center justify-center gap-2 transition-colors mb-2 text-sm font-medium"
        >
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {notesList.length === 0 ? (
          <div className="text-gray-500 text-sm italic text-center mt-10">No notes yet</div>
        ) : (
          notesList.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${activeNoteId === note.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText size={16} className="shrink-0" />
                <span className="truncate">{note.title || 'Untitled Note'}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 rounded shrink-0 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useStore } from '../store/notesStore';
import { Plus, Trash2, FileText, Search, Network, Sparkles, Settings } from 'lucide-react';

export default function Sidebar({ onSearchClick, onGraphClick, onAIClick, onSettingsClick }) {
  const { activeNoteId, createNote, setActiveNoteId, deleteNote, getAllNotes } = useStore();
  const notesList = getAllNotes();

  return (
    <div className="w-72 bg-dark-sidebar border-r border-gray-800/40 h-full flex flex-col shrink-0 transition-colors">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-800/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-500/20 flex items-center justify-center">
            <Sparkles size={14} className="text-brand-500" />
          </div>
          <h1 className="font-bold text-text-primary text-sm tracking-wide">Nexus</h1>
        </div>
        <div className="flex gap-0.5">
          <button onClick={onSearchClick} className="p-1.5 text-gray-500 hover:text-text-primary hover:bg-gray-800/60 rounded-md transition-all" title="Search (Cmd+K)">
            <Search size={15} />
          </button>
          <button onClick={onGraphClick} className="p-1.5 text-gray-500 hover:text-text-primary hover:bg-gray-800/60 rounded-md transition-all" title="Graph View (Cmd+G)">
            <Network size={15} />
          </button>
          <button onClick={onAIClick} className="p-1.5 text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-md transition-all" title="AI Chat (Cmd+/)">
            <Sparkles size={15} />
          </button>
          <button onClick={onSettingsClick} className="p-1.5 text-gray-500 hover:text-text-primary hover:bg-gray-800/60 rounded-md transition-all" title="Settings">
            <Settings size={15} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={createNote}
          className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700/80 text-text-primary rounded-lg flex items-center justify-center gap-2 transition-all border border-gray-700/50 shadow-sm text-sm font-medium"
        >
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 px-3 pb-4">
        {notesList.length === 0 ? (
          <div className="text-gray-500 text-sm p-4 text-center">No notes yet. Create one!</div>
        ) : (
          notesList.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                activeNoteId === note.id 
                  ? 'bg-gray-800/60 text-text-primary shadow-sm ring-1 ring-gray-700/50' 
                  : 'text-gray-500 hover:bg-gray-800/30 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 w-full overflow-hidden">
                <FileText size={15} className={`shrink-0 ${activeNoteId === note.id ? 'text-brand-400' : 'text-gray-600'}`} />
                <span className="truncate font-medium text-sm">{note.title || 'Untitled'}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 hover:bg-red-500/10 rounded shrink-0 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

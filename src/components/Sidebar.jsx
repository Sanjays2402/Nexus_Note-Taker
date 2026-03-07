import { useStore } from '../store/notesStore';
import { Plus, Trash2, FileText, Search, Network, Sparkles, Settings } from 'lucide-react';

export default function Sidebar({ onSearchClick, onGraphClick, onAIClick, onSettingsClick }) {
  const { activeNoteId, createNote, setActiveNoteId, deleteNote, getAllNotes } = useStore();
  const notesList = getAllNotes();

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/5 h-full flex flex-col shrink-0 transition-colors">
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 px-1">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-black pl-[1px]">
            <Sparkles size={11} fill="currentColor" />
          </div>
          <h1 className="font-semibold text-text-primary text-[13px] tracking-tight m-0">Nexus</h1>
        </div>
        <div className="flex gap-1">
          <button onClick={onSearchClick} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-md transition-all" title="Search (Cmd+K)">
            <Search size={14} />
          </button>
          <button onClick={onGraphClick} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-md transition-all" title="Graph View (Cmd+G)">
            <Network size={14} />
          </button>
          <button onClick={onAIClick} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-md transition-all" title="AI Chat (Cmd+/)">
            <Sparkles size={14} />
          </button>
          <button onClick={onSettingsClick} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-md transition-all" title="Settings">
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={createNote}
          className="w-full py-1.5 px-3 bg-white hover:bg-gray-200 text-black rounded-md flex items-center gap-2 transition-all text-[13px] font-medium shadow-sm"
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-[2px] px-2 pb-4">
        {notesList.length === 0 ? (
          <div className="text-text-muted text-xs p-4 text-center">No notes yet</div>
        ) : (
          notesList.map(note => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-150 ${
                activeNoteId === note.id
                  ? 'bg-white/10 text-white'
                  : 'text-text-muted hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5 w-full overflow-hidden">
                <FileText size={13} className={`shrink-0 ${activeNoteId === note.id ? 'text-white/80' : 'text-white/40'}`} />
                <span className="truncate font-medium text-[13px] leading-tight pt-[1px]">{note.title || 'Untitled'}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 hover:bg-red-500/10 rounded shrink-0 transition-all ml-1"
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

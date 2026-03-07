import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import SearchModal from "./components/SearchModal";
import GraphView from "./components/GraphView";
import AiChat from "./components/AiChat";
import SettingsModal from "./components/SettingsModal";
import { useStore } from "./store/notesStore";

export default function App() {
  const { activeNoteId, createNote, settings } = useStore();

  useEffect(() => {
    // Apply theme to document root
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [settings.theme]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K => Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // Cmd/Ctrl + N => New Note
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNote();
      }
      // Cmd/Ctrl + G => Graph View
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGraphOpen(prev => !prev);
      }
      // Cmd/Ctrl + / => AI Panel
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsAIOpen(prev => !prev);
      }
      // Escape
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsGraphOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNote]);

  return (
    <div className="flex h-screen w-full bg-dark-bg text-text-primary overflow-hidden">
      <Sidebar 
        onSearchClick={() => setIsSearchOpen(true)} 
        onGraphClick={() => setIsGraphOpen(true)}
        onAIClick={() => setIsAIOpen(prev => !prev)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      {activeNoteId ? (
        <>
          <Editor />
          <Preview />
        </>
      ) : (
        <div className="flex-1 bg-dark-bg flex flex-col items-center justify-center">
          <div className="text-center max-w-lg p-10 bg-gray-900/20 rounded-3xl border border-gray-800/30 shadow-2xl backdrop-blur-xl">
            <div className="w-20 h-20 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-brand-500/20">
              <svg className="text-brand-500 w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-3xl text-text-primary font-bold mb-3 tracking-tight">Nexus Notes</h2>
            <p className="text-gray-500 text-lg mb-8">Your personal knowledge base</p>
            
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400 text-left">
              <div className="bg-gray-800/30 hover:bg-gray-800/50 p-4 border border-gray-800/50 rounded-xl transition-colors">
                <kbd className="bg-black/50 border border-gray-700/50 font-mono text-xs px-2 py-1 mx-1 rounded shadow-sm text-gray-300">Cmd+K</kbd> Search Notes
              </div>
              <div className="bg-gray-800/30 hover:bg-gray-800/50 p-4 border border-gray-800/50 rounded-xl transition-colors">
                <kbd className="bg-black/50 border border-gray-700/50 font-mono text-xs px-2 py-1 mx-1 rounded shadow-sm text-gray-300">Cmd+G</kbd> Knowledge Graph
              </div>
              <div className="bg-gray-800/30 hover:bg-gray-800/50 p-4 border border-gray-800/50 rounded-xl transition-colors">
                <kbd className="bg-black/50 border border-gray-700/50 font-mono text-xs px-2 py-1 mx-1 rounded shadow-sm text-gray-300">Cmd+N</kbd> New Note
              </div>
              <div className="bg-gray-800/30 hover:bg-gray-800/50 p-4 border border-gray-800/50 rounded-xl transition-colors">
                <kbd className="bg-black/50 border border-gray-700/50 font-mono text-xs px-2 py-1 mx-1 rounded shadow-sm text-gray-300">Cmd+/</kbd> AI Chat
              </div>
            </div>
          </div>
        </div>
      )}

      <AiChat isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <GraphView isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

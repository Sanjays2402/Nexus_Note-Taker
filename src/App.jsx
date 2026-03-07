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
          <div className="flex flex-col items-center max-w-sm text-center">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
              <svg className="text-white/60 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl text-text-primary font-medium mb-2 tracking-tight">Nexus</h2>
            <p className="text-text-muted text-sm mb-8">A thoughtful space for your thoughts.</p>
            
            <div className="flex flex-col gap-2 w-full text-sm text-text-muted text-left">
              <div className="flex justify-between items-center px-4 py-2 border border-white/5 bg-white/[0.02] rounded-lg">
                <span>New Note</span>
                <kbd className="font-mono text-xs text-white/40">Cmd+N</kbd>
              </div>
              <div className="flex justify-between items-center px-4 py-2 border border-white/5 bg-white/[0.02] rounded-lg">
                <span>Search</span>
                <kbd className="font-mono text-xs text-white/40">Cmd+K</kbd>
              </div>
              <div className="flex justify-between items-center px-4 py-2 border border-white/5 bg-white/[0.02] rounded-lg">
                <span>Graph View</span>
                <kbd className="font-mono text-xs text-white/40">Cmd+G</kbd>
              </div>
              <div className="flex justify-between items-center px-4 py-2 border border-white/5 bg-white/[0.02] rounded-lg">
                <span>AI Chat</span>
                <kbd className="font-mono text-xs text-white/40">Cmd+/</kbd>

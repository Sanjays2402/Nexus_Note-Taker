import React, { useState } from 'react';
import { useStore } from '../store/notesStore';
import { X, Save, Download, Settings as SettingsIcon } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings, getAllNotes } = useStore();
  const [provider, setProvider] = useState(settings.aiProvider || 'claude');
  const [claudeKey, setClaudeKey] = useState(settings.claudeApiKey || '');
  const [openAiKey, setOpenAiKey] = useState(settings.openAiApiKey || '');
  const [theme, setTheme] = useState(settings.theme || 'dark');
  const [fontFamily, setFontFamily] = useState(settings.fontFamily || 'sans');
  const [fontSize, setFontSize] = useState(settings.fontSize || 14);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      aiProvider: provider,
      claudeApiKey: claudeKey,
      openAiApiKey: openAiKey,
      theme,
      fontFamily,
      fontSize
    });
    onClose();
  };

  const handleExport = () => {
    const zip = new JSZip();
    const notes = getAllNotes();
    
    notes.forEach(note => {
      // safe filename
      const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'}-${note.id.substring(0,6)}.md`;
      zip.file(filename, note.content);
    });

    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, 'nexus_notes_export.zip');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-[#111] border border-white/10 w-full max-w-md rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <SettingsIcon size={16} className="text-white/40" />
            <h2 className="font-medium text-text-primary text-[14px]">Settings</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-white">AI Provider</label>
            <div className="flex bg-[#181818] border border-white/10 rounded-lg p-1 w-full relative">
              <button
                onClick={() => setProvider('claude')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors ${provider === 'claude' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                Claude
              </button>
              <button
                onClick={() => setProvider('openai')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors ${provider === 'openai' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                OpenAI
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-white">
              {provider === 'claude' ? 'Claude API Key' : 'OpenAI API Key'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={provider === 'claude' ? claudeKey : openAiKey}
                onChange={(e) => provider === 'claude' ? setClaudeKey(e.target.value) : setOpenAiKey(e.target.value)}
                placeholder={provider === 'claude' ? "sk-ant-..." : "sk-..."}
                className="w-full bg-[#181818] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-text-primary outline-none focus:border-white/30 focus:bg-[#222] transition-colors placeholder-white/20 shadow-inner"
              />
            </div>
            <p className="text-[12px] text-white/40 mt-1">Stored locally in your browser workspace.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-white">Editor Theme</label>
            <div className="flex bg-[#181818] border border-white/10 rounded-lg p-1 w-full relative">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                Light
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-white">Typography</label>
            <div className="flex bg-[#181818] border border-white/10 rounded-lg p-1 w-full relative">
              <button
                onClick={() => setFontFamily('sans')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors font-sans ${fontFamily === 'sans' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('serif')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors font-serif ${fontFamily === 'serif' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('mono')}
                className={`flex-1 flex items-center justify-center text-[12px] font-medium py-1.5 rounded-md transition-colors font-mono ${fontFamily === 'mono' ? 'bg-[#2a2a2a] text-white border border-white/5 shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                Mono
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-medium text-white">Editor Font Size</label>
              <span className="text-[11px] text-white/40 font-mono bg-[#181818] border border-white/10 px-2 py-0.5 rounded">{fontSize}px</span>
            </div>
            <div className="pt-2 pb-1">
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1.5 cursor-pointer bg-white/10 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={handleExport}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10 text-[13px] font-medium shadow-sm hover:border-white/20"
            >
              <Download size={14} />
              Export Notes as .zip
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-white/5 bg-black/50 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-1.5 bg-white hover:bg-gray-200 text-black rounded-lg flex items-center gap-2 transition-colors text-[13px] font-medium shadow-sm"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

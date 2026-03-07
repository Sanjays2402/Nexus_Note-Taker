import React, { useState } from 'react';
import { useStore } from '../store/notesStore';
import { X, Save, Download, Settings as SettingsIcon } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings, getAllNotes } = useStore();
  const [apiKey, setApiKey] = useState(settings.claudeApiKey || '');
  const [theme, setTheme] = useState(settings.theme || 'dark');
  const [fontSize, setFontSize] = useState(settings.fontSize || 14);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      claudeApiKey: apiKey,
      theme,
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

        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-2.5">
            <label className="text-[13px] font-medium text-white/80">Claude API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[13px] text-text-primary outline-none focus:border-white/30 transition-colors placeholder-white/20"
            />
            <p className="text-[11px] text-white/40">Stored locally in your browser.</p>
          </div>

          <div className="space-y-2.5">
            <label className="text-[13px] font-medium text-white/80">Editor Theme</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2.5 text-[13px] text-white/60 cursor-pointer hover:text-white transition-colors">
                <input
                  type="radio"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                  className="accent-white"
                />
                Dark
              </label>
              <label className="flex items-center gap-2.5 text-[13px] text-white/60 cursor-pointer hover:text-white transition-colors">
                <input
                  type="radio"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                  className="accent-white"
                />
                Light
              </label>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="flex justify-between text-[13px] font-medium text-white/80">
              <span>Editor Font Size</span>
              <span className="text-white/40 font-mono">{fontSize}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={handleExport}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10 text-[13px]"
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

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-dark-sidebar border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <SettingsIcon size={18} className="text-gray-400" />
            <h2 className="font-bold text-text-primary text-lg">Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Claude API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-500"
            />
            <p className="text-xs text-gray-500">Stored locally in your browser.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Editor Theme</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input 
                  type="radio" 
                  checked={theme === 'dark'} 
                  onChange={() => setTheme('dark')}
                  className="accent-brand-500"
                />
                Dark
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input 
                  type="radio" 
                  checked={theme === 'light'} 
                  onChange={() => setTheme('light')}
                  className="accent-brand-500"
                />
                Light
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-gray-300">
              <span>Editor Font Size</span>
              <span>{fontSize}px</span>
            </label>
            <input 
              type="range" 
              min="12" 
              max="24" 
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button 
              onClick={handleExport}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-text-primary rounded-md flex items-center justify-center gap-2 transition-colors border border-gray-700"
            >
              <Download size={16} />
              Export Notes as .zip
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

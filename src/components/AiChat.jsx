import React, { useState, useEffect, useRef } from 'react';
import { useAI } from '../hooks/useAI';
import { Send, X, Sparkles, MessageSquare } from 'lucide-react';
import { marked } from 'marked';

export default function AiChat({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading, error, clearChat } = useAI();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const starterPrompts = [
    "Summarize my recent notes",
    "What topics am I naturally focusing on?",
    "Find connections between my notes"
  ];

  return (
    <div className="w-80 bg-dark-sidebar border-l border-gray-800 h-full flex flex-col shrink-0 relative transition-all">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-brand-500" />
          <h2 className="font-bold text-text-primary">Nexus AI</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
            <MessageSquare size={32} className="mb-4 text-gray-700" />
            <p className="mb-6">Chat with your notes. Ask questions, get summaries, or find connections.</p>
            <div className="flex flex-col gap-2 w-full">
              {starterPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="px-3 py-2 bg-gray-800/50 hover:bg-brand-600/20 text-xs text-left rounded border border-gray-700 hover:border-brand-500/50 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[90%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-200'}`}
                dangerouslySetInnerHTML={{ __html: m.role === 'assistant' ? marked.parse(m.content || '...', { breaks:true }) : m.content }}
              />
            </div>
          ))
        )}
        
        {error && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-dark-sidebar relative">
        <input
          type="text"
          disabled={isLoading}
          placeholder="Ask Claude..."
          className="w-full bg-gray-900 border border-gray-700 rounded-full pl-4 pr-10 py-2 text-sm text-text-primary outline-none focus:border-brand-500 disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-500 disabled:text-gray-600 hover:text-brand-400 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

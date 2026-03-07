import { useState, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { useStore } from '../store/notesStore';

export function useAI() {
  const { settings, getAllNotes } = useStore();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    if (!settings.claudeApiKey) {
      setError("Please set your Claude API key in settings.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const userMessage = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(p => [...p, userMessage]);

      const client = new Anthropic({
        apiKey: settings.claudeApiKey,
        dangerouslyAllowBrowser: true // Need this to run in browser
      });

      const notes = getAllNotes();
      let systemPrompt = "You are an AI assistant built into a personal knowledge base called Nexus Notes. The user is asking questions about their notes. Use the provided notes to answer their questions.\n\nHere are the user's notes:\n\n";
      
      notes.forEach(note => {
        systemPrompt += `--- NOTE: ${note.title} ---\n${note.content}\n\n`;
      });

      // We add an empty assistant message to stream into
      setMessages(p => [...p, { role: 'assistant', content: '' }]);

      const stream = await client.messages.create({
        max_tokens: 2048,
        messages: newMessages,
        model: 'claude-opus-4-5',
        system: systemPrompt,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.text) {
          fullResponse += chunk.delta.text;
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: fullResponse };
            return copy;
          });
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred communicating with Claude.");
      // Remove the empty assistant message if it failed before starting
      // but simpler to just show the error in the UI
    } finally {
      setIsLoading(false);
    }
  }, [messages, settings.claudeApiKey, getAllNotes]);

  const clearChat = () => setMessages([]);

  return { messages, sendMessage, isLoading, error, clearChat };
}

import { useState, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { useStore } from '../store/notesStore';

export function useAI() {
  const { settings, getAllNotes } = useStore();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    const aiProvider = settings.aiProvider || 'claude';
    if (aiProvider === 'claude' && !settings.claudeApiKey) {
      setError("Please set your Claude API key in settings.");
      return;
    }
    if (aiProvider === 'openai' && !settings.openAiApiKey) {
      setError("Please set your OpenAI API key in settings.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const userMessage = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(p => [...p, userMessage]);

      const notes = getAllNotes();
      let systemPrompt = "You are an AI assistant built into a personal knowledge base called Nexus Notes. The user is asking questions about their notes. Use the provided notes to answer their questions.\n\nHere are the user's notes:\n\n";
      
      notes.forEach(note => {
        systemPrompt += `--- NOTE: ${note.title} ---\n${note.content}\n\n`;
      });

      // We add an empty assistant message to stream into
      setMessages(p => [...p, { role: 'assistant', content: '' }]);

      let fullResponse = '';

      if (aiProvider === 'claude') {
        const client = new Anthropic({
          apiKey: settings.claudeApiKey,
          dangerouslyAllowBrowser: true // Need this to run in browser
        });

        const stream = await client.messages.create({
          max_tokens: 2048,
          messages: newMessages,
          model: 'claude-3-opus-20240229',
          system: systemPrompt,
          stream: true,
        });

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
      } else if (aiProvider === 'openai') {
        const openai = new OpenAI({
          apiKey: settings.openAiApiKey,
          dangerouslyAllowBrowser: true // Need this to run in browser
        });

        const stream = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            setMessages(prev => {
              const copy = [...prev];
              copy[copy.length - 1] = { role: 'assistant', content: fullResponse };
              return copy;
            });
          }
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred communicating with the AI provider.");
      // Remove the empty assistant message if it failed before starting
      // but simpler to just show the error in the UI
    } finally {
      setIsLoading(false);
    }
  }, [messages, settings.aiProvider, settings.claudeApiKey, settings.openAiApiKey, getAllNotes]);

  const clearChat = () => setMessages([]);

  return { messages, sendMessage, isLoading, error, clearChat };
}

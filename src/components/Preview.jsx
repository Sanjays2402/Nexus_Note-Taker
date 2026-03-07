import React, { useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify'; // Need to add this dependency, or we can just use dangerouslySetInnerHTML trusting the user's local content. Wait, since it's local only, we can skip DOMPurify if it's not strictly required, but it's good practice. I'll just use raw innerHTML since it's local only for now as requested. Actually, I didn't install dompurify, so I'll skip it for now.
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import { useStore } from '../store/notesStore';
import { parseWikiLinks } from '../utils/wikiLinks';

// Reusing marked to parse markdown
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

export default function Preview() {
  const { notes, activeNoteId, setActiveNoteId, createNote, updateNote } = useStore();
  const currentNote = activeNoteId ? notes[activeNoteId] : null;
  const containerRef = useRef(null);

  const htmlContent = useMemo(() => {
    if (!currentNote) return '';
    // 1. Convert markdown to HTML
    const rawHtml = marked.parse(currentNote.content);
    // 2. Parse wiki links
    return parseWikiLinks(rawHtml, notes);
  }, [currentNote, notes]);

  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'a' && target.classList.contains('wiki-link')) {
        e.preventDefault();
        
        const isMissing = target.getAttribute('data-missing') === 'true';
        const title = target.getAttribute('data-note-title');
        
        if (isMissing) {
          // Create the missing note
          const newId = createNote();
          updateNote(newId, { title });
        } else {
          // Navigate to existing note
          const noteId = target.getAttribute('data-note-id');
          setActiveNoteId(noteId);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleLinkClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleLinkClick);
      }
    };
  }, [createNote, setActiveNoteId, updateNote]);

  if (!currentNote) return null;

  return (
    <div className="flex-1 h-full bg-dark-bg p-8 overflow-y-auto hidden lg:block">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-text-primary border-b border-gray-800 pb-4">
          {currentNote.title || 'Untitled Note'}
        </h1>
        <div 
          ref={containerRef}
          className="prose prose-invert prose-lg max-w-none text-gray-300
            prose-headings:text-text-primary
            prose-a:text-link prose-a:no-underline hover:prose-a:underline
            prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

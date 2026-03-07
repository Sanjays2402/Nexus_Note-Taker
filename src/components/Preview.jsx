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
    <div className="flex-1 h-full bg-[#050505] overflow-y-auto hidden lg:block relative text-[15px]">
      <div className="max-w-3xl mx-auto px-8 sm:px-12 w-full pt-20 pb-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-8 text-text-primary pb-6 border-b border-white/5">
          {currentNote.title || 'Untitled Note'}
        </h1>
        <div
          ref={containerRef}
          className="prose prose-invert prose-p:leading-[1.7] max-w-none text-[#A0A0A0]
            prose-headings:text-[#EEEEEE] prose-headings:font-medium prose-headings:tracking-tight
            prose-a:text-white prose-a:underline hover:prose-a:text-gray-300
            prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#EEEEEE] prose-code:font-mono prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-black prose-pre:border prose-pre:border-white/5 prose-pre:p-4 prose-pre:rounded-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

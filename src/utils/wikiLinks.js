// Parses wiki links in the format [[Note Title]]
export function parseWikiLinks(content, notes) {
  const wikiLinkRegex = /\[\[(.*?)\]\]/g;
  
  return content.replace(wikiLinkRegex, (match, title) => {
    const note = Object.values(notes).find((n) => n.title.toLowerCase() === title.toLowerCase());
    
    if (note) {
      // Note exists
      return `<a href="#" class="wiki-link text-link hover:underline" data-note-title="${title}" data-note-id="${note.id}">${title}</a>`;
    } else {
      // Note missing (ghost link)
      return `<a href="#" class="wiki-link text-gray-500 underline decoration-dashed hover:text-link transition-colors" data-note-title="${title}" data-missing="true">${title}</a>`;
    }
  });
}

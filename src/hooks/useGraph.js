import { useStore } from '../store/notesStore';

export function useGraph() {
  const { notes } = useStore();

  const getGraphData = () => {
    const nodes = [];
    const links = [];
    const titleToIdMap = {};
    const noteTitles = [];

    // First pass: create all note nodes
    Object.values(notes).forEach(note => {
      titleToIdMap[note.title.toLowerCase()] = note.id;
      noteTitles.push(note.title);
      nodes.push({
        id: note.id,
        name: note.title || 'Untitled',
        isGhost: false,
        linkCount: 0 // Will increment later
      });
    });

    const wikiLinkRegex = /\[\[(.*?)\]\]/g;

    // Second pass: create links
    Object.values(notes).forEach(note => {
      const matches = [...note.content.matchAll(wikiLinkRegex)];
      const currentNoteId = note.id;

      matches.forEach(match => {
        const targetTitle = match[1];
        const targetId = titleToIdMap[targetTitle.toLowerCase()];

        if (targetId) {
          links.push({
            source: currentNoteId,
            target: targetId
          });
          
          // Increment link counts
          const sourceNode = nodes.find(n => n.id === currentNoteId);
          const targetNode = nodes.find(n => n.id === targetId);
          if (sourceNode) sourceNode.linkCount += 1;
          if (targetNode) targetNode.linkCount += 1;
        } else {
          // It's a ghost node!
          const ghostId = `ghost-${targetTitle.toLowerCase()}`;
          if (!nodes.find(n => n.id === ghostId)) {
            nodes.push({
              id: ghostId,
              name: targetTitle,
              isGhost: true,
              linkCount: 1 // at least 1 incoming link
            });
          } else {
            const ghostNode = nodes.find(n => n.id === ghostId);
            if(ghostNode) ghostNode.linkCount += 1;
          }

          links.push({
            source: currentNoteId,
            target: ghostId
          });
          
          const sourceNode = nodes.find(n => n.id === currentNoteId);
          if (sourceNode) sourceNode.linkCount += 1;
        }
      });
    });

    return { nodes, links };
  };

  return { getGraphData };
}

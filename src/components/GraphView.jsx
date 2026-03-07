import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../store/notesStore';
import { useGraph } from '../hooks/useGraph';

export default function GraphView({ isOpen, onClose }) {
  const containerRef = useRef(null);
  const { setActiveNoteId, createNote, updateNote } = useStore();
  const { getGraphData } = useGraph();

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Clear previous
    containerRef.current.innerHTML = '';
    
    const { nodes, links } = getGraphData();
    
    if (nodes.length === 0) {
      containerRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">No data to display</div>';
      return;
    }

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
      }))
      .append('g');

    const g = svg.append('g');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => 10 + d.linkCount * 2));

    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#4b5563')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => 8 + (d.linkCount * 2))
      .attr('fill', d => d.isGhost ? '#1a1a1a' : '#6366F1') // brand-500
      .attr('stroke', d => d.isGhost ? '#4b5563' : 'none')
      .attr('stroke-width', d => d.isGhost ? 2 : 0)
      .attr('stroke-dasharray', d => d.isGhost ? '4' : 'none')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        if (d.isGhost) {
          const newId = createNote();
          updateNote(newId, { title: d.name });
          setActiveNoteId(newId);
        } else {
          setActiveNoteId(d.id);
        }
        onClose();
      });

    node.append('title')
      .text(d => d.name + (d.isGhost ? ' (click to create)' : ''));

    const labels = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .attr('fill', '#e5e5e5')
      .attr('font-size', '12px')
      .style('pointer-events', 'none')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [isOpen, getGraphData, createNote, setActiveNoteId, updateNote, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex flex-col pt-10 px-10 pb-10">
      <div className="flex justify-between items-center px-4 py-3 shrink-0 absolute top-4 left-4 right-4 z-50 pointer-events-none">
        <h2 className="text-lg font-medium text-white tracking-tight pointer-events-auto bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">Knowledge Graph</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-full transition-colors text-[13px] font-medium pointer-events-auto shadow-xl"
        >
          Close View
        </button>
      </div>
      <div className="flex-1 w-full bg-black border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden" ref={containerRef} />
    </div>
  );
}

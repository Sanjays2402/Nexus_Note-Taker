import React from "react";
export default function App() {
  return (
    <div className="flex h-screen w-full bg-dark-bg text-text-primary">
      <div className="w-64 bg-dark-sidebar border-r border-gray-800 p-4">
        <h1 className="text-xl font-bold mb-4">Nexus Notes</h1>
        <button className="w-full py-2 bg-accent text-white rounded">+ New Note</button>
      </div>
      <div className="flex-1 bg-dark-editor flex items-center justify-center">
        <p className="text-gray-400">Select or create a note to begin</p>
      </div>
    </div>
  );
}

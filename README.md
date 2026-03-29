# 📝 Nexus Note-Taker

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)

A powerful, Obsidian-inspired **note-taking app** with wiki-style linking, graph visualization, AI chat, and a beautiful dark/light theme — all running in the browser with local persistence.

## ✨ Features

- 📄 **Markdown editor** with live preview
- 🔗 **Wiki-style `[[links]]`** between notes
- 🕸️ **Graph view** — visualize note connections as an interactive network
- 🤖 **AI chat panel** — Claude or OpenAI integration for note-based Q&A
- 🔍 **Quick search** (`Cmd/Ctrl + K`) across all notes
- 🏷️ Tags and metadata per note
- 🌙 **Dark & light themes** with font family selection (sans/serif/mono)
- 💾 **Local persistence** via Zustand + localStorage
- ⌨️ **Keyboard shortcuts** — `Cmd+N` new note, `Cmd+G` graph, `Cmd+/` AI panel

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite** — fast dev/build
- **Zustand** — lightweight state management with persistence
- **UUID** — unique note IDs

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Sanjays2402/Nexus_Note-Taker.git
cd Nexus_Note-Taker

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 🏗️ Project Structure

```
Nexus_Note-Taker/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Note list & navigation
│   │   ├── Editor.jsx        # Markdown editor
│   │   ├── Preview.jsx       # Live markdown preview
│   │   ├── GraphView.jsx     # Interactive note graph
│   │   ├── AiChat.jsx        # AI chat panel
│   │   ├── SearchModal.jsx   # Quick search overlay
│   │   └── SettingsModal.jsx # Theme & AI settings
│   ├── hooks/
│   │   ├── useGraph.js       # Graph data computation
│   │   └── useAI.js          # AI provider integration
│   ├── store/
│   │   └── notesStore.js     # Zustand store with persistence
│   ├── utils/
│   │   └── wikiLinks.js      # [[wiki link]] parser
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Search notes |
| `Cmd/Ctrl + N` | New note |
| `Cmd/Ctrl + G` | Toggle graph view |
| `Cmd/Ctrl + /` | Toggle AI panel |
| `Escape` | Close modals |

## 👤 Author

**Sanjay Santhanam**

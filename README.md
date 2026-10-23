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

## Terms & Disclaimer

By using this project you agree to the following.

- **No warranty.** This software is provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
- **No liability.** To the maximum extent permitted by law, the author and contributors are not liable for any claim, loss, or damage (direct, indirect, incidental, or consequential, including lost data or profits) arising from its use.
- **Your responsibility.** You use it at your own risk and are responsible for complying with the laws that apply to you.
- **Your data.** Keep backups; data loss is possible. If you process other people's personal information, you are responsible for complying with privacy laws such as US state privacy laws (e.g. CCPA), PIPEDA and Quebec's Law 25 (Canada), and the Digital Personal Data Protection Act, 2023 (India).
- **Third parties.** Names, logos, APIs, and services of others belong to their owners and are used for identification only; no affiliation or endorsement is implied.
- **Your statutory rights.** Nothing here limits rights that cannot be waived by agreement, including under consumer-protection laws in the USA, Canada (including Quebec), and India (Consumer Protection Act, 2019).
- **License.** Use, copying, and distribution are governed by the [LICENSE](LICENSE) file; if anything here conflicts with it, the license controls.

## Content, Assets & Fair Use

- **Original work.** Unless noted otherwise (including below), the code, text, design, and images in this repository were created by the author.
- **Libraries, fonts, and icons.** Third-party libraries, fonts (for example Google Fonts), and icon sets belong to their creators and are used under their own licenses; see the dependency manifests and each source for terms.
- **Logos, brands, and screenshots.** Third-party names, logos, and screenshots appear only to identify or describe their products (nominative use). They remain the property of their owners and do not imply affiliation or endorsement.
- **Ideas and inspiration.** Where this project is inspired by another product, game, or idea, it is an independent implementation. It borrows only general ideas, mechanics, or styles, which are not anyone's exclusive property, and is meant to contain no third-party code or artwork used without permission.
- **Fair use and fair dealing.** Any third-party material is used in limited ways for purposes such as education, research, review, commentary, or identification, relying on fair use in the USA (17 U.S.C. § 107), fair dealing in Canada (Copyright Act, ss. 29–29.2), and fair dealing in India (Copyright Act, 1957, s. 52), where they apply.
- **Concerns and takedown requests.** If you own rights in something here and believe it is used improperly, [open an issue](https://github.com/Sanjays2402/Nexus_Note-Taker/issues) or contact the author through their GitHub profile with a link to the material and your claim. It will be reviewed promptly and credited, changed, or removed as appropriate. You may also use GitHub's DMCA process.
- **Contributions.** By contributing, you confirm you have the right to submit your contribution and agree it is licensed under this repository's license.

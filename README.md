# HTML File Viewer

A standalone, zero-dependency HTML file viewer with a tabbed interface. Open multiple `.html` files, edit the code in a textbox with line numbers, preview live in-app, or pop the rendered page into a new `about:blank` tab.

## Features

- 🗂️ **Tabbed interface** — keep multiple HTML files open and switch between them (Chrome-style tabs, middle-click or × to close)
- 📂 **Open HTML files** — load any `.html` / `.htm` file into a new tab
- ✏️ **Editable code box** — with line numbers and char count
- 👁️ **Live preview** — debounced in-app iframe (scripts run sandboxed)
- 🪟 **New tab window** — renders the page in a fresh `about:blank` tab
- 🔄 **Split / Code / Preview** views
- 📋 Copy, 💾 Save, 🔁 Refresh, ↩ Wrap toggle, 🧹 Clear
- ⌨️ `Tab` inserts 2 spaces · `Ctrl+T` new tab · `Ctrl+W` close tab
- 🌙 Google-inspired dark UI (Google Sans + Roboto Mono)

## Run

Just open `index.html` in any browser. No build step, no server required.

```
git clone <your-repo>
cd html-viewer
# open index.html
```

## Files

```
html-viewer/
├── index.html
├── style.css
└── script.js
```

## Notes

- The preview iframe is sandboxed (`allow-scripts allow-forms allow-modals allow-popups allow-same-origin`).
- "New Tab" writes your code into a real `about:blank` document for a true full-page render.

MIT — free to use.

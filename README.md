# TreeGen | File Tree Generator

Visualize your project structure instantly. Share clean ASCII diagrams. Keep your data private.

## Why It Exists

You're documenting a project. You need to show the folder structure. You copy-paste manually or hunt for obscure CLI commands. It's tedious. Then you worry about uploading files to some random online service. What if it's sensitive code? What if you forget to delete it?

## How It Works

TreeGen lets you select any folder from your computer and generates a clean ASCII tree diagram instantly. In your browser. On your machine. Nothing leaves your device.

- **100% Private** - All processing happens in your browser. We never see your files.
- **Zero Dependencies** - No installation. No CLI. Just select a folder and go.
- **Flexible Output** - Toggle folders-only mode. Hide or show hidden files. Filter out node_modules automatically.
- **One Click Copy** - Generated tree ready to paste into documentation, tickets, or chat.

## How to Use

1. Open [TreeGen](https://file-tree-generator-sigma.vercel.app/)
2. Click "Select Folders" and choose your project directory
3. Customize the view:
   - **Folders only** - Show directory structure without files
   - **Show hidden files** - Include `.env`, `.gitignore`, and other dotfiles
4. Copy the tree diagram with one click
5. Paste it anywhere you need it

## Example Output

```
my-project (Root)
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   ├── utils/
│   │   └── helpers.js
│   └── index.js
├── public/
│   └── index.html
├── package.json
├── README.md
└── .gitignore
```

## Features

- **Automatic node_modules filtering** - Uploading your whole project? No worries. node_modules is always excluded.
- **Hidden file support** - See `.env`, `.gitignore`, `.github` and other dotfiles when you need them
- **Folder-only mode** - Focus on architecture without file clutter
- **Dark mode** - Reads your system preference and adapts
- **Mobile friendly** - Works on any device with a browser

## Privacy

Your files never touch our servers. Everything runs entirely in your browser memory. Close the page or refresh, and everything is gone. That's the promise.

## Built By

[xodobyte](https://github.com/xodobyte)

## License

MIT

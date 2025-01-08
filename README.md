# Photoshop Shortcuts Cheatsheet

[Live Demo](YOUR_VERCEL_LINK_HERE)

An interactive cheatsheet for Photoshop's essential keyboard shortcuts, built with Next.js and Tailwind CSS. This project features an elegant, responsive design with support for both Windows and Mac keyboard combinations.

## Features

- 🎨 Comprehensive collection of essential Photoshop shortcuts
- 💻 Cross-platform support (Windows/Mac)
- 🔄 Interactive UI with expandable modifier keys
- 📱 Fully responsive design
- 🌙 Clean, modern interface
- ⌨️ Keyboard-friendly navigation
- 🎯 Organized by categories for easy reference

## Categories Covered

- Essential Navigation
- Quick Tools
- Tool Modifiers
- View Controls
- Layer Operations
- Clipboard Operations
- Undo/Redo Operations

## Technical Details

Built using:
- Next.js 14 (App Router)
- Tailwind CSS
- Radix UI (via shadcn/ui)
- Lucide React Icons
- TypeScript

## Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/photoshop-shortcuts-cheatsheet.git

# Navigate to the project directory
cd photoshop-shortcuts-cheatsheet

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── page.tsx           # Main cheatsheet component
│   └── layout.tsx         # Root layout
├── components/
│   └── ui/               # shadcn/ui components
├── public/
│   └── ...              # Static assets
└── package.json
```

## Key Components

- `PhotoshopCheatsheet`: Main component that renders the entire cheatsheet
- `ShortcutCard`: Individual shortcut card with expandable modifier hints
- `ShortcutSection`: Groups related shortcuts together
- `OSToggle`: Toggles between Mac and Windows shortcuts
- `KeyCombo`: Renders keyboard shortcut combinations
- `ModifierHint`: Shows additional modifier key information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - feel free to use this project for your own learning or as a starting point for your own cheatsheet application.

## Credits

- Design inspired by modern application documentation sites
- Icons provided by [Lucide](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

## Deployment

This project is optimized for deployment on Vercel, but can be deployed on any platform that supports Next.js applications.

---

Made with ♥️ for the design community
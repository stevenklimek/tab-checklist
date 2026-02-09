# Tab Checklist

A transparent desktop checklist widget for macOS. Keep your tasks visible on your wallpaper without hunting through browser tabs.

## Features

- 5 customizable columns (easily add more)
- Semi-transparent widget that floats on your desktop
- Clickable hyperlinks - add URLs to any item
- Check items off, edit inline, delete
- Data syncs between editor app and desktop widget
- Persists across restarts

## Requirements

- macOS
- Node.js (for the sync server)
- Google Chrome (preferred) or Safari
- Homebrew (to install Übersicht)

## Installation

### 1. Install Übersicht (the desktop widget engine)

```bash
brew install --cask ubersicht
```

### 2. Copy the widget file to Übersicht

```bash
cp tab-checklist.jsx ~/Library/Application\ Support/Übersicht/widgets/
```

### 3. Launch Übersicht

- Open Übersicht from your Applications folder
- Click the Übersicht icon in your menubar
- Enable "Open at Login" (recommended)

### 4. Start using

- Double-click `TabChecklist.app` to open the editor
- Add items, check them off, click to add hyperlinks
- Changes sync to the desktop widget automatically

## Customizing Columns

Edit the `COLUMNS` array in **both** files:

**checklist.html** (around line 310):
```javascript
const COLUMNS = [
    { id: 'priority', name: 'PRIORITY', color: '#00b894' },
    { id: 'work', name: 'WORK', color: '#ff6b6b' },
    // ... add or modify columns
];
```

**tab-checklist.jsx** (around line 37):
```javascript
const COLUMNS = [
  { id: "priority", name: "PRIORITY", color: "#00b894" },
  { id: "work", name: "WORK", color: "#ff6b6b" },
  // ... must match checklist.html
];
```

After editing, copy the updated HTML to the app:
```bash
cp checklist.html TabChecklist.app/Contents/Resources/
```

## Customizing Appearance

Edit `tab-checklist.jsx`:

**Position** (line 18-21):
```javascript
top: 40px;      // distance from top of screen
left: 60px;     // distance from left (room for dock/sidebar)
right: 20px;    // distance from right
```

**Transparency** (line 51):
```javascript
background: rgba(30, 30, 30, 0.46);  // lower = more transparent
```

**Link color** (line 118):
```javascript
color: #56a0d3;  // change to any hex color
```

## Files

- `TabChecklist.app` - Editor app (double-click to launch)
- `tab-checklist.jsx` - Übersicht widget (copy to widgets folder)
- `checklist.html` - The editor interface
- `server.js` - Sync server (starts automatically with the app)

## Data Storage

Your checklist data is saved at:
```
~/.tab-checklist-data.json
```

## Troubleshooting

**Widget not showing?**
- Make sure Übersicht is running (check your menubar)
- Click Übersicht icon → Refresh All Widgets

**Editor shows "Local only"?**
- The sync server may not be running
- Close and reopen TabChecklist.app

**Links not clickable on desktop widget?**
- Click Übersicht icon → Refresh All Widgets

## Adding/Removing Columns

1. Edit the `COLUMNS` array in both `checklist.html` and `tab-checklist.jsx`
2. Update `grid-template-columns: repeat(X, 1fr)` where X = number of columns
   - In `checklist.html`: line 52
   - In `tab-checklist.jsx`: line 46
3. Copy updated HTML to app bundle:
   ```bash
   cp checklist.html TabChecklist.app/Contents/Resources/
   ```

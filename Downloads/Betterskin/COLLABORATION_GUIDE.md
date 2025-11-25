# Collaboration Guide - Inviting Teammates & Quick Access

## Part 1: Inviting Teammates to GitHub Repository

### Method 1: Add Collaborators (Recommended)

1. **Go to your repository** on GitHub (e.g., `github.com/YOUR_USERNAME/Betterskin`)

2. **Click "Settings"** (top menu bar of your repository)

3. **Click "Collaborators"** in the left sidebar
   - If you don't see it, click "Access" → "Collaborators"

4. **Click "Add people"** button

5. **Enter your teammate's GitHub username or email**

6. **Select permission level:**
   - **Write** - They can edit files and push changes (recommended for teammates)
   - **Read** - They can only view (if you just want them to see the code)

7. **Click "Add [username] to this repository"**

8. **Your teammate will receive an email invitation** - they need to accept it

### Method 2: Make Repository Public (Easiest)

If you want anyone to view the code (but not edit):
1. Go to **Settings** → **General**
2. Scroll down to **"Danger Zone"**
3. Click **"Change visibility"** → **"Make public"**
4. Anyone with the link can now view it

---

## Part 2: Quick Access to Your Project

### Option A: Bookmark the Live Site (Recommended)

Once deployed on GitHub Pages, your site will be at:
```
https://YOUR_USERNAME.github.io/Betterskin/
```

**To bookmark:**
1. Open the site in your browser
2. Press `Cmd + D` (Mac) or `Ctrl + D` (Windows)
3. Click "Done" to save the bookmark

### Option B: Create a Desktop Shortcut

**On Mac:**
1. Open your site in Safari/Chrome
2. Click the URL bar
3. Drag the favicon (small icon) to your Desktop
4. Double-click to open anytime

**On Windows:**
1. Open your site in Chrome/Edge
2. Click the three dots menu (⋮)
3. Go to **"More tools"** → **"Create shortcut"**
4. Check "Open as window" (optional)
5. Click "Create"

### Option C: Pin to Browser Tab

1. Open your site
2. Right-click the tab
3. Select **"Pin tab"**
4. It will stay open and minimized

### Option D: Add to Home Screen (Mobile)

**On iPhone/iPad:**
1. Open the site in Safari
2. Tap the Share button (square with arrow)
3. Tap **"Add to Home Screen"**
4. Tap "Add"

**On Android:**
1. Open the site in Chrome
2. Tap the three dots menu
3. Tap **"Add to Home screen"**
4. Tap "Add"

---

## Quick Access Links

### For Development (Local):
```
http://localhost:8000
```
(Run `python3 -m http.server 8000` in the project folder)

### For Production (Live Site):
```
https://YOUR_USERNAME.github.io/Betterskin/
```

### For GitHub Repository:
```
https://github.com/YOUR_USERNAME/Betterskin
```

---

## Sharing with Non-Technical Teammates

If your teammates just want to **use the app** (not edit code):

1. **Share the GitHub Pages URL:**
   ```
   https://YOUR_USERNAME.github.io/Betterskin/
   ```

2. **They can bookmark it** or you can send them the link

3. **No GitHub account needed** - they just use the website!

---

## Team Workflow Tips

### If Teammates Need to Edit Code:

1. **They accept the GitHub invitation** (from their email)

2. **They clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Betterskin.git
   cd Betterskin
   ```

3. **Make changes locally**

4. **Push changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

5. **GitHub Pages automatically updates** (takes 1-2 minutes)

### If You Want to Test Locally First:

```bash
cd /Users/allapolishchuk/Downloads/Betterskin
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

---

## Quick Reference

| What | Where |
|------|-------|
| **Live Website** | `https://YOUR_USERNAME.github.io/Betterskin/` |
| **Repository** | `https://github.com/YOUR_USERNAME/Betterskin` |
| **Add Collaborators** | Repository → Settings → Collaborators |
| **Local Testing** | `python3 -m http.server 8000` → `http://localhost:8000` |



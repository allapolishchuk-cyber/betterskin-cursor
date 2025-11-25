# How to Open & Work on the Project

## Part 1: Opening the Project on Your Laptop

### Option A: Clone from GitHub (Recommended)

1. **Open Terminal** (Mac) or **Command Prompt** (Windows)

2. **Navigate to where you want the project:**
   ```bash
   cd ~/Desktop
   # or any folder you prefer
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/allapolishchuk-cyber/betterskin-cursor.git
   ```

4. **Go into the project folder:**
   ```bash
   cd betterskin-cursor
   ```

5. **Open the project:**
   - **Option 1:** Open `index.html` in your browser directly
   - **Option 2:** Run a local server (recommended):
     ```bash
     python3 -m http.server 8000
     ```
     Then open: `http://localhost:8000`

6. **To edit:**
   - Open `index.html` in any text editor (VS Code, Sublime, etc.)

---

## Part 2: Someone Else Opening the Project

### Step 1: Give Them Access

**Option A: Make Repository Public (Easiest)**
1. Go to: `https://github.com/allapolishchuk-cyber/betterskin-cursor`
2. Click **Settings** → **General**
3. Scroll to **"Danger Zone"**
4. Click **"Change visibility"** → **"Make public"**
5. Now anyone with the link can clone it

**Option B: Add Them as Collaborator**
1. Go to: `https://github.com/allapolishchuk-cyber/betterskin-cursor`
2. Click **Settings** → **Collaborators** (or **Access** → **Collaborators**)
3. Click **"Add people"**
4. Enter their GitHub username or email
5. Give them **"Write"** access
6. They'll get an email invitation

### Step 2: They Clone the Project

**On their laptop, they run:**

```bash
# 1. Clone the repository
git clone https://github.com/allapolishchuk-cyber/betterskin-cursor.git

# 2. Go into the folder
cd betterskin-cursor

# 3. Run local server
python3 -m http.server 8000
# (or: python -m http.server 8000  on Windows)

# 4. Open browser to:
# http://localhost:8000
```

**If they don't have Python:**
- They can just open `index.html` directly in a browser
- Or install Python from [python.org](https://www.python.org)

---

## Part 3: Quick Reference

### For You (Local Development):

```bash
# Navigate to project
cd /Users/allapolishchuk/Downloads/Betterskin

# Run local server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000
```

### For Teammates (Cloning):

```bash
# Clone repository
git clone https://github.com/allapolishchuk-cyber/betterskin-cursor.git

# Go into folder
cd betterskin-cursor

# Run server
python3 -m http.server 8000

# Open browser
# http://localhost:8000
```

---

## Part 4: Making Changes & Sharing

### When You Make Changes:

1. **Edit `index.html`** locally
2. **Test it** at `http://localhost:8000`
3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **GitHub Pages automatically updates** (takes 1-2 minutes)

### When Teammates Make Changes:

1. **They edit** `index.html` locally
2. **They test** at `http://localhost:8000`
3. **They push:**
   ```bash
   git add .
   git commit -m "Their changes"
   git push
   ```
4. **Everyone sees the update** on the live site

---

## Part 5: Opening Without Git (Just Viewing)

If someone just wants to **view/edit the code** without Git:

1. **Go to GitHub:**
   `https://github.com/allapolishchuk-cyber/betterskin-cursor`

2. **Click on `index.html`**

3. **Click the pencil icon** (Edit) to edit directly on GitHub

4. **Or download:**
   - Click **"Code"** → **"Download ZIP"**
   - Extract and open `index.html` in browser

---

## Summary

| What | How |
|------|-----|
| **View live site** | `https://allapolishchuk-cyber.github.io/betterskin-cursor/` |
| **Clone to your laptop** | `git clone https://github.com/allapolishchuk-cyber/betterskin-cursor.git` |
| **Run locally** | `python3 -m http.server 8000` → `http://localhost:8000` |
| **Share with others** | Make repo public OR add them as collaborators |
| **They clone** | Same `git clone` command |

---

## Troubleshooting

**"git: command not found"**
- Install Git: [git-scm.com](https://git-scm.com)

**"python3: command not found"**
- Install Python: [python.org](https://www.python.org)
- Or just open `index.html` directly in browser

**"Permission denied"**
- Make sure repository is public OR they're added as collaborators



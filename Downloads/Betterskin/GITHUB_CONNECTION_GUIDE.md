# How to Connect Local Files to GitHub

## Overview
Once connected, you **don't need to manually upload files every time**. Git tracks changes automatically, and you just push updates with a few commands.

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `betterskin` (or any name you want)
   - **Description**: (optional)
   - **Visibility**: Choose **Public** (for GitHub Pages) or **Private**
   - **DO NOT** check "Initialize with README" (you already have files)
4. Click **"Create repository"**

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/betterskin.git

# Or if you prefer SSH (if you have SSH keys set up):
# git remote add origin git@github.com:YOUR_USERNAME/betterskin.git
```

**Example:**
```bash
git remote add origin https://github.com/allapolishchuk-cyber/betterskin-cursor.git
```

## Step 3: Push Your Files to GitHub

```bash
# Commit your staged changes
git commit -m "Initial commit: refactored codebase with modules"

# Push to GitHub (first time)
git push -u origin main
```

## Step 4: Future Updates (You Don't Need to Upload Manually!)

After the initial setup, updating GitHub is just 3 commands:

```bash
# 1. Stage all changes
git add .

# 2. Commit with a message
git commit -m "Description of what you changed"

# 3. Push to GitHub
git push
```

That's it! No manual uploading needed.

## Quick Reference Commands

### Check Status
```bash
git status                    # See what files changed
git remote -v                 # Check if GitHub is connected
```

### Daily Workflow
```bash
git add .                     # Stage all changes
git commit -m "Your message"  # Save changes locally
git push                      # Upload to GitHub
```

### View Changes
```bash
git log                       # See commit history
git diff                      # See what changed (before staging)
```

## Troubleshooting

### If you get "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add it again with correct URL
git remote add origin https://github.com/YOUR_USERNAME/betterskin.git
```

### If you get authentication errors
- Use **Personal Access Token** instead of password
- Or set up **SSH keys** for easier authentication

### If you want to pull changes from GitHub
```bash
git pull origin main
```

## Benefits of This Workflow

✅ **Automatic tracking** - Git knows what changed  
✅ **Version history** - See all past versions  
✅ **Easy collaboration** - Others can contribute  
✅ **Backup** - Your code is safe on GitHub  
✅ **No manual uploads** - Just `git push`  

## Next Steps

1. Create the GitHub repository
2. Run the connection commands above
3. Push your code
4. Start using `git add .`, `git commit`, `git push` for updates!


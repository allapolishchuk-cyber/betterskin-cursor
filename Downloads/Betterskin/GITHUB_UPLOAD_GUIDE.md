# GitHub Upload Guide for Betterskin

## Files to Upload to GitHub

Upload **ALL** of these files to your GitHub repository:

### Required Files (for the website to work):
- ✅ **index.html** - This is the main file that contains everything

### Documentation Files (helpful to include):
- ✅ **supabase-schema.sql** - Database schema
- ✅ **SUPABASE_SETUP.md** - Setup instructions
- ✅ **QUICK_SUPABASE_SETUP.md** - Quick setup guide
- ✅ **CHECK_SUPABASE_DATA.md** - Data checking guide
- ✅ **DEPLOYMENT.md** - Deployment instructions
- ✅ **GITHUB_UPLOAD_GUIDE.md** - This file
- ✅ **.gitignore** - Git ignore file (optional but recommended)

## Step-by-Step Instructions

### 1. Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it: `Betterskin` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. **DO NOT** check "Add a README file" (we'll upload our own files)
6. Click **"Create repository"**

### 2. Upload Files via GitHub Web Interface
1. On your new repository page, click **"uploading an existing file"** link
2. Drag and drop **ALL** the files from your `Betterskin` folder:
   - index.html
   - supabase-schema.sql
   - SUPABASE_SETUP.md
   - QUICK_SUPABASE_SETUP.md
   - CHECK_SUPABASE_DATA.md
   - DEPLOYMENT.md
   - .gitignore (if you want to include it)
3. Scroll down and click **"Commit changes"**

### 3. Enable GitHub Pages
1. In your repository, go to **Settings** (top menu)
2. Click **Pages** in the left sidebar
3. Under **"Source"**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for GitHub to build your site

### 4. Access Your Site
Your site will be available at:
```
https://YOUR_USERNAME.github.io/Betterskin/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Alternative: Upload via Command Line

If you prefer using Terminal:

```bash
cd /Users/allapolishchuk/Downloads/Betterskin

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Betterskin app"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/Betterskin.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Important Notes

- ✅ The `index.html` file contains everything (HTML, CSS, JavaScript) - it's a single-file app
- ✅ Your Supabase credentials are already in the code, so it will work immediately
- ✅ Make sure the repository is **Public** for free GitHub Pages
- ✅ After enabling Pages, wait 1-2 minutes for the site to be available

## Troubleshooting

**Site not loading?**
- Check that the repository is Public
- Verify GitHub Pages is enabled in Settings → Pages
- Wait a few minutes for the build to complete
- Check the URL format: `https://username.github.io/repository-name/`

**Files not showing?**
- Make sure `index.html` is in the root of the repository (not in a subfolder)
- Verify all files were uploaded successfully



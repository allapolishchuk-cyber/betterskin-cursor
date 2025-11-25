# Fix GitHub Pages - Step by Step

## Step 1: Check Repository Settings

1. Go to: `https://github.com/allapolishchuk-cyber/betterskin-cursor`
2. Click **"Settings"** (top menu bar)
3. Scroll down and click **"Pages"** in the left sidebar

## Step 2: Enable GitHub Pages

In the Pages settings, you should see:

**Source:**
- [ ] Select branch: Choose **`main`** (or `master` if that's your branch)
- [ ] Select folder: Choose **`/ (root)`**
- [ ] Click **"Save"**

## Step 3: Wait for Build

After saving:
- You'll see a message: "Your site is ready to be published at..."
- Wait **2-3 minutes** for GitHub to build your site
- The status will show a green checkmark when ready

## Step 4: Check Repository Visibility

1. Still in **Settings**, click **"General"**
2. Scroll to **"Danger Zone"**
3. If it says **"Private"**, you need to make it public:
   - Click **"Change visibility"**
   - Click **"Make public"**
   - Confirm

**Note:** Free GitHub Pages only works with public repositories.

## Step 5: Verify index.html Location

1. Go to your repository main page
2. Make sure `index.html` is in the **root** (not in a subfolder)
3. It should appear directly in the file list

## Step 6: Check Build Status

1. Click the **"Actions"** tab in your repository
2. Look for any failed builds (red X)
3. If there's an error, click on it to see details

## Step 7: Try Alternative URLs

If the main URL doesn't work, try:

1. **With index.html:**
   ```
   https://allapolishchuk-cyber.github.io/betterskin-cursor/index.html
   ```

2. **Check exact repository name:**
   - Go to your repository
   - Check the exact name (case-sensitive)
   - URL must match exactly: `betterskin-cursor` (lowercase with hyphen)

## Common Issues & Fixes

### Issue: "404 Not Found"
- **Fix:** Make sure GitHub Pages is enabled (Settings → Pages)
- **Fix:** Wait 2-3 minutes after enabling
- **Fix:** Make repository public

### Issue: "Page build failed"
- **Fix:** Check Actions tab for error details
- **Fix:** Make sure index.html is in root directory

### Issue: "Repository not found"
- **Fix:** Check the repository name matches exactly
- **Fix:** Make sure repository exists and is accessible

### Issue: Still shows old content
- **Fix:** Clear browser cache: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- **Fix:** Try incognito/private browsing mode

## Quick Checklist

- [ ] Repository is **Public** (not Private)
- [ ] GitHub Pages is **enabled** (Settings → Pages)
- [ ] Branch is set to **`main`** (or `master`)
- [ ] Folder is set to **`/ (root)`**
- [ ] `index.html` is in the **root directory**
- [ ] Waited **2-3 minutes** after enabling
- [ ] Checked **Actions** tab for build status
- [ ] Tried hard refresh: `Cmd + Shift + R`

## Still Not Working?

1. **Check the exact error message** - what do you see when you visit the URL?
2. **Screenshot the Pages settings** - share what you see
3. **Check Actions tab** - any build errors?

Let me know what error you're seeing and I can help fix it!



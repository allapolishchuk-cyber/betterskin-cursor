# GitHub Pages Troubleshooting

## Common Issues & Fixes

### Issue 1: 404 Error or "Page not found"

**Possible causes:**
1. GitHub Pages not enabled
2. Wrong branch selected
3. Files not in root directory
4. Repository name mismatch

**Fix:**
1. Go to your repository: `https://github.com/allapolishchuk-cyber/betterskin-cursor`
2. Click **Settings** → **Pages**
3. Under **"Source"**, make sure:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 2-3 minutes for GitHub to build

### Issue 2: Wrong URL Format

GitHub Pages URLs are case-sensitive and must match exactly:
- ✅ Correct: `https://allapolishchuk-cyber.github.io/betterskin-cursor/`
- ❌ Wrong: `https://allapolishchuk-cyber.github.io/Betterskin-Cursor/`
- ❌ Wrong: `https://allapolishchuk-cyber.github.io/betterskin_cursor/`

### Issue 3: index.html Not in Root

**Check:**
1. Go to your repository
2. Make sure `index.html` is directly in the root (not in a subfolder)
3. It should show: `index.html` (not `folder/index.html`)

### Issue 4: Repository Not Public

**Fix:**
1. Go to **Settings** → **General**
2. Scroll to **"Danger Zone"**
3. If it says "Private", click **"Change visibility"** → **"Make public"**
4. GitHub Pages only works with public repositories (free tier)

### Issue 5: Build Still Processing

**Check build status:**
1. Go to **Settings** → **Pages**
2. Look for a green checkmark or yellow dot
3. If yellow, it's still building (wait 2-3 minutes)
4. If red, there's an error (check the Actions tab)

---

## Quick Checklist

- [ ] Repository is **Public**
- [ ] GitHub Pages is **enabled** (Settings → Pages)
- [ ] Branch is set to **`main`** (or `master`)
- [ ] Folder is set to **`/ (root)`**
- [ ] `index.html` is in the **root directory**
- [ ] Waited **2-3 minutes** after enabling Pages
- [ ] URL matches repository name exactly (case-sensitive)

---

## Verify Your Setup

1. **Check repository structure:**
   ```
   betterskin-cursor/
   ├── index.html          ← Must be here (root)
   ├── supabase-schema.sql
   └── ... (other files)
   ```

2. **Check GitHub Pages settings:**
   - Repository → Settings → Pages
   - Source: `main` branch, `/ (root)` folder

3. **Check URL:**
   - Must be: `https://allapolishchuk-cyber.github.io/betterskin-cursor/`
   - Note the lowercase and hyphen

---

## Still Not Working?

1. **Check the Actions tab:**
   - Go to your repository
   - Click **"Actions"** tab
   - Look for any failed builds

2. **Try accessing directly:**
   - `https://allapolishchuk-cyber.github.io/betterskin-cursor/index.html`

3. **Clear browser cache:**
   - Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

4. **Check repository visibility:**
   - Make sure it's Public (not Private)



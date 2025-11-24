# How to Share Your Betterskin Project

## Option 1: Netlify (Easiest - Recommended)

### Steps:
1. Go to [netlify.com](https://www.netlify.com) and sign up (free)
2. Once logged in, you'll see a "Sites" page
3. **Drag and drop** your entire `Betterskin` folder onto the Netlify dashboard
4. Netlify will automatically deploy your site and give you a URL like: `https://random-name-123.netlify.app`
5. Share this URL with your teammates!

### To update:
- Just drag and drop the folder again, or
- Use Netlify CLI for updates

---

## Option 2: GitHub Pages (Free, requires GitHub account)

### Steps:
1. Create a GitHub account at [github.com](https://github.com) if you don't have one
2. Create a new repository (click "+" → "New repository")
3. Name it `Betterskin` (or any name you like)
4. Don't initialize with README
5. Open Terminal and run:

```bash
cd /Users/allapolishchuk/Downloads/Betterskin
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Betterskin.git
git push -u origin main
```

6. Go to your repository on GitHub
7. Click **Settings** → **Pages**
8. Under "Source", select `main` branch and `/ (root)` folder
9. Click **Save**
10. Your site will be available at: `https://YOUR_USERNAME.github.io/Betterskin/`

---

## Option 3: Vercel (Free, easy)

### Steps:
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click "Add New Project"
3. Import from GitHub (if you've set up GitHub) or drag and drop
4. Vercel will give you a URL like: `https://betterskin.vercel.app`

---

## Important Notes:

⚠️ **Supabase Configuration**: Your Supabase credentials are already in the code. Make sure:
- Your Supabase project allows public access (which it should with the anon key)
- Row Level Security (RLS) policies are set correctly
- Your teammates can access the Supabase database (or you can create separate user accounts)

🔒 **Security Note**: The Supabase anon key is public by design, but make sure your RLS policies are properly configured to protect user data.

---

## Quick Test:
After deployment, test that:
1. The site loads correctly
2. Products can be added
3. Routines are saved to Supabase
4. Data persists across page refreshes

---

## Recommended: Netlify
**Why Netlify?**
- ✅ Easiest setup (just drag and drop)
- ✅ Free SSL certificate
- ✅ Custom domain support (optional)
- ✅ Automatic deployments
- ✅ No command line needed


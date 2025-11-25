# Supabase Setup Guide for BetterSkin

This guide will help you set up Supabase to store your products, routines, and profile data in a database instead of just localStorage.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: BetterSkin (or any name you like)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be created

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 3: Create the Database Tables

There are a few ways to run the SQL schema. Choose the method that works best for you:

### Method 1: Using SQL Editor (Recommended)

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. You should see a text area/editor in the middle of the screen
   - If you see an empty editor, you're ready to go!
   - If you see example queries or templates, you can clear them or just paste below them
3. Open the `supabase-schema.sql` file from this folder
4. Copy **ALL** the contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)
5. Paste it into the SQL Editor text area (Cmd/Ctrl + V)
6. Click the **"Run"** button (usually in the bottom right, or press **Cmd/Ctrl + Enter**)
7. You should see "Success. No rows returned" or a green success message

### Method 2: Using Table Editor (Alternative)

If you can't find the SQL Editor or prefer a visual approach:

1. Go to **Table Editor** in the left sidebar
2. Click **"New table"** or the **"+"** button
3. Create each table manually:
   - **profiles**: user_id (text, primary key), profile_data (jsonb), updated_at (timestamptz)
   - **routines**: user_id (text, primary key), routines_data (jsonb), updated_at (timestamptz)
   - **schedules**: user_id (text, primary key), schedule_data (jsonb), start_date (timestamptz), updated_at (timestamptz)

**Note**: Method 1 is much faster! If you're having trouble finding the SQL Editor, try:
- Looking in the left sidebar menu
- The URL should be something like: `https://supabase.com/dashboard/project/YOUR_PROJECT/sql`
- You can also search for "SQL" in the Supabase dashboard

## Step 4: Update Your HTML File

1. Open `index.html` in a text editor
2. Find these lines near the top of the `<script>` section:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace them with your actual credentials:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';  // Your Project URL
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // Your anon key
   ```
4. Save the file

## Step 5: Test It

1. Start your local server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser
3. Open the browser console (F12)
4. Add a product to your routine
5. You should see: "Routines saved to Supabase" in the console
6. Refresh the page - your product should still be there!

## How It Works

- **Without Supabase**: Data is stored in your browser's localStorage (only on your computer)
- **With Supabase**: Data is stored in a cloud database (accessible from any device/browser)

The app automatically:
- Falls back to localStorage if Supabase isn't configured
- Saves data to Supabase when you add/edit products
- Loads data from Supabase when you open the app

## Troubleshooting

### Can't find SQL Editor
- Look in the left sidebar - it should be near the bottom
- Try navigating directly: Go to your project → SQL Editor
- The SQL Editor might be called "SQL" or have a database icon
- If you still can't find it, use Method 2 above (Table Editor) or contact Supabase support

### "Error saving routines to Supabase"
- Check that your SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Make sure you ran the SQL schema in Step 3
- Check the browser console for detailed error messages
- Verify the tables were created: Go to Table Editor and you should see `profiles`, `routines`, and `schedules` tables

### Products not persisting
- Check the browser console for errors
- Verify your Supabase project is active (not paused)
- Make sure you're using the same browser (user_id is stored in localStorage)

### Data not syncing across devices
- The current implementation uses a browser-based user_id
- For true multi-device sync, you'd need to implement Supabase Authentication
- For now, each browser/device will have its own data

## Next Steps (Optional)

For production use, consider:
- Implementing Supabase Authentication for user accounts
- Adding error handling and retry logic
- Implementing data backup/export features
- Adding offline support with service workers


# Quick Supabase Setup - Step by Step

## Finding the SQL Editor

1. **Log into Supabase**: Go to https://supabase.com and sign in
2. **Select your project**: Click on your BetterSkin project (or create one if you haven't)
3. **Find SQL Editor**: 
   - Look at the **left sidebar menu**
   - Scroll down if needed
   - Find **"SQL Editor"** (it has a database/query icon)
   - Click on it

## Running the SQL

Once you're in the SQL Editor:

1. You'll see a **large text area** in the middle of the screen
2. This is where you paste SQL code
3. **Copy the entire contents** of `supabase-schema.sql` file
4. **Paste it** into that text area
5. Look for a **"Run"** button (usually bottom right, or green button)
6. **Click "Run"** or press **Cmd+Enter** (Mac) / **Ctrl+Enter** (Windows)

## What You Should See

✅ **Success**: "Success. No rows returned" or a green checkmark
❌ **Error**: Red error message (usually means tables already exist, which is fine!)

## Alternative: Direct SQL Execution

If you still can't find the SQL Editor button:

1. Go to: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql`
   (Replace YOUR_PROJECT_ID with your actual project ID from the URL)
2. This should take you directly to the SQL Editor

## Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see 3 new tables:
   - `profiles`
   - `routines`  
   - `schedules`

If you see these tables, you're all set! ✅

## Still Having Issues?

**Option 1**: Take a screenshot of your Supabase dashboard and I can help guide you
**Option 2**: Use the Table Editor method (slower but works)
**Option 3**: The app will work with localStorage as a fallback - you can set up Supabase later



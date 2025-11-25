# How to Check if Data is in Supabase

## Method 1: Using Table Editor (Easiest)

1. Go to your Supabase dashboard
2. Click on **Table Editor** in the left sidebar
3. Click on the **`routines`** table
4. You should see rows with:
   - `user_id` (like `user_1234567890_abc123`)
   - `routines_data` (a JSON object with your products)
   - `updated_at` (timestamp)

**Note**: If you see data here, it's working! The products are stored inside the `routines_data` JSON field.

## Method 2: Using SQL Editor

1. Go to **SQL Editor** in Supabase
2. Run this query:
   ```sql
   SELECT * FROM routines;
   ```
3. This will show all saved routines data

## Method 3: Check Browser Console

1. Open your app in the browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Add a product
5. Look for:
   - ✅ "Routines saved to Supabase successfully"
   - ❌ Any error messages

## Understanding the Data Structure

Products are stored in a JSON structure like this:
```json
{
  "morning": {
    "cleanser": [
      {
        "name": "Product Name",
        "category": "cleanser",
        "percentageLeft": 100
      }
    ]
  },
  "evening": {
    "cleanser": [...]
  }
}
```

This entire structure is stored in the `routines_data` column as JSONB.

## Troubleshooting

### No data in Supabase?
1. Check browser console for errors (F12 → Console)
2. Verify your credentials are correct in `index.html`
3. Check if RLS (Row Level Security) is blocking writes
4. Try refreshing the page and adding a product again

### Data in localStorage but not Supabase?
- The app falls back to localStorage if Supabase fails
- Check the console for error messages
- The error will tell you what went wrong

### Can't see the data structure?
- The data is stored as JSONB (JSON Binary)
- In Table Editor, click on the `routines_data` cell to expand it
- Or use SQL Editor to query it




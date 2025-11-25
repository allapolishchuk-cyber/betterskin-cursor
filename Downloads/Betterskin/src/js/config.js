/**
 * Supabase Configuration
 * Replace these with your Supabase project credentials
 * Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
 */
export const SUPABASE_URL = 'https://tsrbhgaksrwscrdvwudg.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcmJoZ2Frc3J3c2NyZHZ3dWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDU2NDEsImV4cCI6MjA3OTQ4MTY0MX0.Gvy7zwlDZ6vvouErWO9avUDX9Z2DHJA5UvrYfCIFJo0';

// Initialize Supabase client
let supabase = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

export const USE_SUPABASE = supabase !== null;
export { supabase };


import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xaunrjigcaxhzepawazo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhdW5yamlnY2F4aHplcGF3YXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NjQ5ODQsImV4cCI6MjA1MzU0MDk4NH0.6zHAzezIkYyMAzEMIHVQrblxEa3ncznzpWtT1SozR_4";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);
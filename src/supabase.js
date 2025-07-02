import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan anon key milikmu sendiri
const supabaseUrl = 'https://uksmhisftpfhmyanermh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrc21oaXNmdHBmaG15YW5lcm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzUwMzksImV4cCI6MjA2Njk1MTAzOX0.lWMW_DuE6LRWVZ8sOmUuaLpk3wOAdPr9swNcveKXDIM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uksmhisftpfhmyanermh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrc21oaXNmdHBmaG15YW5lcm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzUwMzksImV4cCI6MjA2Njk1MTAzOX0.lWMW_DuE6LRWVZ8sOmUuaLpk3wOAdPr9swNcveKXDIM'
);

export default supabase;
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbpgfkvtinmkubzrdcji.supabase.co'; // your project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icGdma3Z0aW5ta3VienJkY2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTc4MjUsImV4cCI6MjA2MDg5MzgyNX0.9RAh9PW-DqSaPO1DSn-EhR3a_tP2fXB6V0GTzld5wmE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
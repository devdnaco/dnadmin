import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  'https://bxjhjmiqdcrcsiiayaom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4amhqbWlxZGNyY3NpaWF5YW9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUwMzM4NSwiZXhwIjoyMDY4MDc5Mzg1fQ.V3GF9sTYeaz0SbuodlSpEuYgDN3-g_3VAKlggx5ZyaE';

export const supabase = createClient(supabaseUrl, supabaseKey);
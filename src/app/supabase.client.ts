import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnajbskfruaklvmnchzv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYWpic2tmcnVha2x2bW5jaHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQwNTIsImV4cCI6MjA2MTM1MDA1Mn0.hCr7K9cHmcOAolpF0RHNyj0RNfMj_PA42HIkaMMR2UI';

export const supabase = createClient(supabaseUrl, supabaseKey);
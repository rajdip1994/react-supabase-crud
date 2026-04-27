import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdsznnxnguypksezxbae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkc3pubnhuZ3V5cGtzZXp4YmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNjYzNTgsImV4cCI6MjA5Mjg0MjM1OH0.vjWlG6xTQtHVgVUFz7uGJHnAVd3atKp7h2qrvTnLI9c';

export const supabase = createClient(supabaseUrl, supabaseKey);
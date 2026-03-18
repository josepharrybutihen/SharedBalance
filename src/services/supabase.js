import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wwycccbmazhwodlutjyp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eWNjY2JtYXpod29kbHV0anlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjA1ODgsImV4cCI6MjA4ODIzNjU4OH0.75oUfuAZu7a5kjE7Y9puorJZ5kcqPX85nAfyblBz4sw";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
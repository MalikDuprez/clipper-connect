import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nymzboedleraaqmooedb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bXpib2VkbGVyYWFxbW9vZWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTI0MDMsImV4cCI6MjA4MDQ4ODQwM30.KsMpoOh6ftSwvft0BVt-Bki5N8iLkbC6IL-27d1JiU0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
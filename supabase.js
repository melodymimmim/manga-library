const supabaseUrl = "https://xtttlmnmyyjfwnnixdjg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dHRsbW5teXlqZndubml4ZGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTA5NjQsImV4cCI6MjA5OTA4Njk2NH0.IPR_xKQrNKw99mto0lbGL-SBMlNUKM3d_hvKrwGYLfU";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
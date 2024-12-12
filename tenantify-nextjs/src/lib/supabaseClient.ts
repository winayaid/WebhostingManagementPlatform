// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = `${
  process.env.SUPABASE_URL ?? "https://imostoqudhempapsqqbp.supabase.co"
}`;
const SUPABASE_ANON_KEY = `${
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltb3N0b3F1ZGhlbXBhcHNxcWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNzYyMzAsImV4cCI6MjA0ODg1MjIzMH0.kJSDV7lEIyE5BJvpvyHqp3-_V_Xhj9tAX8tbJgETkgY"
}`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

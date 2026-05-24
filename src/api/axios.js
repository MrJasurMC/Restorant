import axios from "axios";

const SUPABASE_URL = "https://qahhwxydzmrlvjjctliz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaGh3eHlkem1ybHZqamN0bGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5NjE4NjksImV4cCI6MjA0NjUzNzg2OX0.llSqz_kr5TndDcM3PStEBYrTSr8-stKj4mCDtetbeGk";

const api = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
});

export const authApi = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

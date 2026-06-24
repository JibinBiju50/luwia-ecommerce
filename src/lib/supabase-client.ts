/**
 * Re-exports the SSR-aware browser client so all existing imports
 * (`import { supabase } from "@/lib/supabase-client"`) continue
 * working without changes across all components.
 */
export { supabase } from "./supabase-browser";

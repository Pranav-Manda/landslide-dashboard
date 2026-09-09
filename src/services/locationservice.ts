import { supabase, hasSupabase } from "../lib/supabase";
import { locations as fallbackLocations } from "../data/locations";

export async function fetchLocations() {
  if (!hasSupabase || !supabase) {
    return fallbackLocations;
  }

  const { data, error } = await supabase
    .from("locations")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return fallbackLocations;
  }

  return data;
}
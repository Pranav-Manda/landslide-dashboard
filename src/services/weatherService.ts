import type { Location } from "../data/locations";
import { hasSupabase, supabase } from "../lib/supabase";

export type LiveWeatherSnapshot = {
  locationName: string;
  temperature: number | null;
  precipitation: number | null;
  humidity: number | null;
  windSpeed: number | null;
  source: "live" | "fallback";
};

export async function fetchLiveWeatherForLocation(
  location: Pick<Location, "name" | "latitude" | "longitude">
): Promise<LiveWeatherSnapshot> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m&timezone=auto&forecast_days=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Open-Meteo request failed");
    }

    const data = await response.json();

    return {
      locationName: location.name,
      temperature: data?.current?.temperature_2m ?? null,
      precipitation: data?.current?.precipitation ?? null,
      humidity: data?.current?.relative_humidity_2m ?? null,
      windSpeed: data?.current?.wind_speed_10m ?? null,
      source: "live",
    };
  } catch {
    return {
      locationName: location.name,
      temperature: null,
      precipitation: null,
      humidity: null,
      windSpeed: null,
      source: "fallback",
    };
  }
}

export async function fetchLiveWeatherForLocations(
  locations: Pick<Location, "id" | "name" | "latitude" | "longitude">[]
): Promise<LiveWeatherSnapshot[]> {
  const results = await Promise.all(
    locations.map((location) => fetchLiveWeatherForLocation(location))
  );

  return results;
}

export async function syncWeatherSnapshotsToSupabase(
  snapshots: LiveWeatherSnapshot[]
) {
  if (!hasSupabase || !supabase) return;

  try {
    const rows = snapshots.map((snapshot) => ({
      location_name: snapshot.locationName,
      temperature: snapshot.temperature,
      precipitation: snapshot.precipitation,
      humidity: snapshot.humidity,
      wind_speed: snapshot.windSpeed,
      source: snapshot.source,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("ai_insights").insert(rows);

    if (error) {
      console.error("Weather sync failed:", error.message);
    }
  } catch (error) {
    console.error("Weather sync failed:", error);
  }
}

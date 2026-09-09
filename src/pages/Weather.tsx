import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  TrendingUp,
  AlertTriangle,
  MapPin,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAppStore } from "../store/appStore";
import {
  fetchLiveWeatherForLocations,
  syncWeatherSnapshotsToSupabase,
  type LiveWeatherSnapshot,
} from "../services/weatherService";

export default function Weather() {
    const { locations } = useAppStore();
    const [liveWeather, setLiveWeather] = useState<LiveWeatherSnapshot[]>([]);
    const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadWeather = async () => {
      setLoadingWeather(true);

      const snapshots = await fetchLiveWeatherForLocations(locations);

      if (!ignore) {
        setLiveWeather(snapshots);
        setLoadingWeather(false);
        await syncWeatherSnapshotsToSupabase(snapshots);
      }
    };

    loadWeather();

    return () => {
      ignore = true;
    };
  }, [locations]);

  const totalRainfall = locations.reduce(
    (sum, location) => sum + location.rainfall,
    0
  );

  const averageRainfall = Math.round(
    totalRainfall / locations.length
  );

  const averageRainfallFallback =
    locations.length > 0 ? averageRainfall : 0;

  const liveRainfallAverage =
    liveWeather.length > 0
      ? Math.round(
          liveWeather.reduce(
            (sum, item) => sum + (item.precipitation ?? 0),
            0
          ) / liveWeather.length
        )
      : averageRainfallFallback;

  const averageSoilMoisture = Math.round(
    locations.reduce(
      (sum, location) => sum + location.soilMoisture,
      0
    ) / locations.length
  );

  const highestRainfallLocation = [...locations].sort(
    (a, b) => b.rainfall - a.rainfall
  )[0];

  const rainfallIntensity =
    liveRainfallAverage >= 100
      ? "VERY HIGH"
      : liveRainfallAverage >= 70
      ? "HIGH"
      : liveRainfallAverage >= 40
      ? "MODERATE"
      : "LOW";

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <h1>Weather & Rainfall</h1>
          <p>
            Environmental monitoring and rainfall assessment
          </p>
        </div>

        <div className="data-status">
          <span className="status-dot"></span>
          {loadingWeather ? "Loading live data..." : "Live weather data"}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="weather-summary-grid">

        <div className="weather-stat-card">
          <div className="weather-stat-icon">
            <CloudRain size={20} />
          </div>

          <div>
            <span>Average Rainfall</span>
            <strong>{liveRainfallAverage} mm</strong>
            <small>Across monitored locations</small>
          </div>
        </div>

        <div className="weather-stat-card">
          <div className="weather-stat-icon">
            <Droplets size={20} />
          </div>

          <div>
            <span>Avg Soil Moisture</span>
            <strong>{averageSoilMoisture}%</strong>
            <small>Current estimated level</small>
          </div>
        </div>

        <div className="weather-stat-card">
          <div className="weather-stat-icon">
            <Thermometer size={20} />
          </div>

          <div>
            <span>Rainfall Intensity</span>
            <strong>{rainfallIntensity}</strong>
            <small>Current assessment</small>
          </div>
        </div>

        <div className="weather-stat-card">
          <div className="weather-stat-icon">
            <MapPin size={20} />
          </div>

          <div>
            <span>Highest Rainfall</span>
            <strong>
              {highestRainfallLocation.rainfall} mm
            </strong>
            <small>
              {highestRainfallLocation.name}
            </small>
          </div>
        </div>

      </div>

      {/* Rainfall Overview */}
      <div className="weather-grid">

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Rainfall Overview</h3>
              <p>
                Current rainfall conditions across monitored
                locations
              </p>
            </div>

            <CloudRain size={20} />
          </div>

          <div className="rainfall-bars">

            {locations
              .slice()
              .sort((a, b) => b.rainfall - a.rainfall)
              .slice(0, 8)
              .map((location) => (
                <div
                  className="rainfall-row"
                  key={location.id}
                >
                  <div className="rainfall-location">
                    <span>{location.name}</span>
                    <strong>
                      {location.rainfall} mm
                    </strong>
                  </div>

                  <div className="rainfall-track">
                    <div
                      className="rainfall-fill"
                      style={{
                        width: `${Math.min(
                          (location.rainfall / 150) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

          </div>
        </div>

        {/* AI Assessment */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>AI Weather Assessment</h3>
              <p>Environmental condition analysis</p>
            </div>

            <TrendingUp size={20} />
          </div>

          <div className="weather-ai-box">

            <div className="weather-ai-title">
              <AlertTriangle size={18} />
              Rainfall Risk Assessment
            </div>

            <p>
              Current rainfall conditions indicate
              {rainfallIntensity === "HIGH" ||
              rainfallIntensity === "VERY HIGH"
                ? " elevated precipitation pressure across several monitored areas."
                : " moderate environmental pressure across monitored areas."}
            </p>

            <p>
              Locations receiving higher rainfall should be
              monitored closely when combined with elevated
              soil moisture and slope susceptibility.
            </p>

            <div className="weather-ai-recommendation">
              <strong>Recommended Action</strong>

              <span>
                Increase monitoring frequency in locations
                showing simultaneous increases in rainfall,
                soil moisture and landslide risk.
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Location Weather Table */}
      <div className="panel">

        <div className="panel-header">
          <div>
            <h3>Location Weather Conditions</h3>
            <p>
              Environmental readings from monitored locations
            </p>
          </div>

          <Wind size={20} />
        </div>

        <div className="weather-table">

          <div className="weather-table-header">
            <span>LOCATION</span>
            <span>RAINFALL</span>
            <span>SOIL MOISTURE</span>
            <span>SLOPE</span>
            <span>RISK</span>
          </div>

          {locations.map((location) => {
            const weatherRecord = liveWeather.find(
              (item) => item.locationName === location.name
            );

            return (
              <div
                className="weather-table-row"
                key={location.id}
              >
                <div className="weather-location">
                  <MapPin size={15} />
                  <div>
                    <strong>{location.name}</strong>
                    <small>{location.state}</small>
                  </div>
                </div>

                <span>
                  {weatherRecord?.precipitation ?? location.rainfall} mm
                </span>

                <span>
                  {weatherRecord?.humidity ?? location.soilMoisture}%
                </span>

                <span>
                  {location.slope}°
                </span>

                <span
                  className="risk-badge"
                  data-risk={location.risk.level}
                >
                  {location.risk.level}
                </span>
              </div>
            );
          })}

        </div>

      </div>

      {/* Data Notice */}
      <div className="weather-notice">
        <CloudRain size={17} />

        <span>
          <strong>Live environmental feed:</strong>{" "}
          Weather data is now pulled directly from Open-Meteo based on each location coordinate and synced to the app when database credentials are configured.
        </span>
      </div>
    </div>
  );
}
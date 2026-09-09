import { useAppStore } from "../store/appStore";
import {
  Activity,
  Battery,
  CheckCircle2,
  CloudRain,
  Droplets,
  MapPin,
  Radio,
  RefreshCw,
  Signal,
  Thermometer,
  Wifi,
  WifiOff,
} from "lucide-react";

interface Station {
  id: number;
  stationId: string;
  locationId: number;
  temperature: number;
  battery: number;
  signal: number;
  connected: boolean;
}

export default function MonitoringStations() {
  const { locations } = useAppStore();

  const stations: Station[] = locations.map((location, index) => ({
    id: location.id,
    stationId: `NER-${String(index + 1).padStart(3, "0")}`,
    locationId: location.id,
    temperature: 22 + (index % 7),
    battery: 82 + (index % 15),
    signal: 72 + (index % 25),
    connected: true,
  }));

  const onlineStations = stations.filter(
    (station) => station.connected
  ).length;

  const offlineStations = stations.length - onlineStations;

  const averageBattery =
    stations.length > 0
      ? stations.reduce((sum, station) => sum + station.battery, 0) /
        stations.length
      : 0;

  const averageSignal =
    stations.length > 0
      ? stations.reduce((sum, station) => sum + station.signal, 0) /
        stations.length
      : 0;

  const getSignalLabel = (signal: number) => {
    if (signal >= 80) return "STRONG";
    if (signal >= 60) return "GOOD";
    return "WEAK";
  };

  const getBatteryLabel = (battery: number) => {
    if (battery >= 70) return "HEALTHY";
    if (battery >= 40) return "MEDIUM";
    return "LOW";
  };

  const networkAvailability =
    stations.length > 0
      ? (onlineStations / stations.length) * 100
      : 0;

  return (
    <div className="main">
      {/* TOP BAR */}

      <div className="topbar">
        <div>
          <div className="eyebrow">FIELD INFRASTRUCTURE</div>

          <h1>Monitoring Stations</h1>

          <p className="page-subtitle">
            Environmental sensor stations deployed across monitored
            landslide-prone locations
          </p>
        </div>

        <div className="topbar-status">
          <span className="status-dot"></span>
          Network Operational
        </div>
      </div>

      {/* SUMMARY */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon safe">
            <Radio size={20} />
          </div>

          <div>
            <span className="stat-label">ONLINE STATIONS</span>

            <strong>{onlineStations}</strong>

            <small>Connected to monitoring network</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon critical">
            <WifiOff size={20} />
          </div>

          <div>
            <span className="stat-label">OFFLINE STATIONS</span>

            <strong>{offlineStations}</strong>

            <small>Require connectivity check</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <Battery size={20} />
          </div>

          <div>
            <span className="stat-label">AVG BATTERY</span>

            <strong>{averageBattery.toFixed(0)}%</strong>

            <small>Station power health</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Signal size={20} />
          </div>

          <div>
            <span className="stat-label">AVG SIGNAL</span>

            <strong>{averageSignal.toFixed(0)}%</strong>

            <small>Network connectivity strength</small>
          </div>
        </div>
      </div>

      {/* NETWORK STATUS */}

      <div className="panel station-network-panel">
        <div className="panel-header">
          <div>
            <h2>Monitoring Network</h2>

            <p>
              Current status of environmental monitoring infrastructure
            </p>
          </div>

          <div className="network-status">
            <span className="status-dot"></span>
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>

        <div className="network-overview">
          <div className="network-progress-section">
            <div className="network-progress-header">
              <span>Network Availability</span>

              <strong>{networkAvailability.toFixed(0)}%</strong>
            </div>

            <div className="network-progress">
              <div
                style={{
                  width: `${networkAvailability}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="network-item">
            <CheckCircle2 size={17} />

            <div>
              <strong>{onlineStations}</strong>
              <span>Online</span>
            </div>
          </div>

          <div className="network-item">
            <RefreshCw size={17} />

            <div>
              <strong>LIVE</strong>
              <span>Data Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATION GRID */}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Station Status</h2>

            <p>
              Live environmental readings and hardware health
            </p>
          </div>

          <Activity size={18} />
        </div>

        <div className="enhanced-station-grid">
          {stations.map((station) => {
            const location = locations.find(
              (item) => item.id === station.locationId
            );

            if (!location) return null;

            return (
              <div
                key={station.id}
                className="enhanced-station-card"
              >
                {/* HEADER */}

                <div className="station-card-header">
                  <div className="station-identity">
                    <div className="station-radio-icon">
                      <Radio size={17} />
                    </div>

                    <div>
                      <strong>{station.stationId}</strong>

                      <span>
                        <MapPin size={11} />
                        {location.name}, {location.state}
                      </span>
                    </div>
                  </div>

                  <div className="station-online">
                    <span className="status-dot"></span>
                    ONLINE
                  </div>
                </div>

                {/* SENSOR READINGS */}

                <div className="sensor-readings">
                  <div className="sensor-reading">
                    <div className="sensor-reading-icon">
                      <CloudRain size={15} />
                    </div>

                    <div>
                      <span>RAINFALL</span>

                      <strong>{location.rainfall} mm</strong>
                    </div>
                  </div>

                  <div className="sensor-reading">
                    <div className="sensor-reading-icon">
                      <Droplets size={15} />
                    </div>

                    <div>
                      <span>SOIL MOISTURE</span>

                      <strong>{location.soilMoisture}%</strong>
                    </div>
                  </div>

                  <div className="sensor-reading">
                    <div className="sensor-reading-icon">
                      <MountainIcon />
                    </div>

                    <div>
                      <span>SLOPE</span>

                      <strong>{location.slope}°</strong>
                    </div>
                  </div>

                  <div className="sensor-reading">
                    <div className="sensor-reading-icon">
                      <Thermometer size={15} />
                    </div>

                    <div>
                      <span>TEMPERATURE</span>

                      <strong>{station.temperature}°C</strong>
                    </div>
                  </div>
                </div>

                {/* HARDWARE */}

                <div className="station-health">
                  <div className="health-item">
                    <div className="health-header">
                      <span>
                        <Battery size={12} />
                        Battery
                      </span>

                      <strong>{station.battery}%</strong>
                    </div>

                    <div className="health-bar">
                      <div
                        style={{
                          width: `${station.battery}%`,
                        }}
                      ></div>
                    </div>

                    <small>
                      {getBatteryLabel(station.battery)}
                    </small>
                  </div>

                  <div className="health-item">
                    <div className="health-header">
                      <span>
                        <Signal size={12} />
                        Signal
                      </span>

                      <strong>{station.signal}%</strong>
                    </div>

                    <div className="health-bar">
                      <div
                        style={{
                          width: `${station.signal}%`,
                        }}
                      ></div>
                    </div>

                    <small>
                      {getSignalLabel(station.signal)}
                    </small>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="station-card-footer">
                  <span>
                    <Wifi size={12} />
                    Connected
                  </span>

                  <span>Last sync: Just now</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SENSOR ARCHITECTURE */}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Station Sensor Architecture</h2>

            <p>
              Parameters monitored by the proposed field stations
            </p>
          </div>

          <Activity size={18} />
        </div>

        <div className="sensor-architecture">
          <div className="architecture-item">
            <CloudRain size={19} />

            <div>
              <strong>Rain Gauge</strong>

              <span>
                Measures rainfall intensity and accumulated
                precipitation
              </span>
            </div>
          </div>

          <div className="architecture-item">
            <Droplets size={19} />

            <div>
              <strong>Soil Moisture Sensor</strong>

              <span>
                Monitors ground saturation and changing soil
                conditions
              </span>
            </div>
          </div>

          <div className="architecture-item">
            <MountainIcon />

            <div>
              <strong>Slope / Tilt Sensor</strong>

              <span>
                Detects changes in slope inclination and stability
              </span>
            </div>
          </div>

          <div className="architecture-item">
            <Thermometer size={19} />

            <div>
              <strong>Temperature Sensor</strong>

              <span>
                Provides supporting environmental measurements
              </span>
            </div>
          </div>

          <div className="architecture-item">
            <Radio size={19} />

            <div>
              <strong>Communication Module</strong>

              <span>
                Sends sensor observations to the central monitoring
                platform
              </span>
            </div>
          </div>

          <div className="architecture-item">
            <Battery size={19} />

            <div>
              <strong>Power Monitoring</strong>

              <span>
                Tracks station battery health and operational
                availability
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable mountain icon */

function MountainIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 3-5 6 10H3L8 3Z" />
      <path d="m3 16 4-5 3 4 3-3 4 5" />
    </svg>
  );
}
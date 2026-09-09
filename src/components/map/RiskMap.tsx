import { useMemo, useState } from "react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  Filter,
  Layers,
  MapPin,
  Search,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAppStore } from "../../store/appStore";
import {
  getRiskColor,
  type RiskLevel,
} from "../../services/riskEngine";

export default function RiskMap() {
    const { locations } = useAppStore();
  const [search, setSearch] = useState("");

  const [selectedRisk, setSelectedRisk] =
    useState<RiskLevel | "ALL">("ALL");

  const [showRainfall, setShowRainfall] = useState(true);

  const [showSoilMoisture, setShowSoilMoisture] =
    useState(false);

  const [showSusceptibility, setShowSusceptibility] =
    useState(false);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        location.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        location.state
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRisk =
        selectedRisk === "ALL" ||
        location.risk.level === selectedRisk;

      return matchesSearch && matchesRisk;
    });
  }, [search, selectedRisk]);

  const criticalCount = locations.filter(
    (location) => location.risk.level === "CRITICAL"
  ).length;

  const highCount = locations.filter(
    (location) => location.risk.level === "HIGH"
  ).length;

  const moderateCount = locations.filter(
    (location) => location.risk.level === "MODERATE"
  ).length;

  const lowCount = locations.filter(
    (location) => location.risk.level === "LOW"
  ).length;

  return (
    <div className="advanced-map-wrapper">

      {/* MAP CONTROLS */}

      <div className="advanced-map-controls">

        <div className="map-search">
          <Search size={15} />

          <input
            type="text"
            placeholder="Search location or state..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              className="map-clear"
              onClick={() => setSearch("")}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="map-filter">

          <Filter size={14} />

          <select
            value={selectedRisk}
            onChange={(event) =>
              setSelectedRisk(
                event.target.value as RiskLevel | "ALL"
              )
            }
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>

        </div>

      </div>

      {/* MAP */}

      <div className="advanced-map-container">

        <MapContainer
          center={[25.8, 91.5]}
          zoom={6}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            width: "100%",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredLocations.map((location) => {

            const riskColor = getRiskColor(
              location.risk.level
            );

            return (
              <CircleMarker
                key={location.id}
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                radius={
                  location.risk.level === "CRITICAL"
                    ? 12
                    : location.risk.level === "HIGH"
                    ? 10
                    : 8
                }
                pathOptions={{
                  color: riskColor,
                  fillColor: riskColor,
                  fillOpacity: 0.78,
                  weight: 2,
                }}
              >

                <Popup>

                  <div className="map-popup">

                    <div className="map-popup-header">

                      <div>
                        <strong>
                          {location.name}
                        </strong>

                        <span>
                          <MapPin size={11} />
                          {location.state}
                        </span>
                      </div>

                      <div
                        className="popup-risk"
                        style={{
                          color: riskColor,
                        }}
                      >
                        {location.risk.score}
                      </div>

                    </div>

                    <div className="popup-risk-level">
                      {location.risk.level} RISK
                    </div>

                    <div className="popup-divider"></div>

                    <div className="popup-grid">

                      <div>
                        <span>Rainfall</span>
                        <strong>
                          {location.rainfall} mm
                        </strong>
                      </div>

                      <div>
                        <span>Soil Moisture</span>
                        <strong>
                          {location.soilMoisture}%
                        </strong>
                      </div>

                      <div>
                        <span>Slope</span>
                        <strong>
                          {location.slope}°
                        </strong>
                      </div>

                      <div>
                        <span>Susceptibility</span>
                        <strong>
                          {location.historicalSusceptibility}%
                        </strong>
                      </div>

                    </div>

                    <div className="popup-divider"></div>

                    <div className="popup-impact">

                      <span>
                        Infrastructure Exposure
                      </span>

                      <strong>
                        {location.infrastructure}
                      </strong>

                    </div>

                    <Link
                      to={`/location/${location.id}`}
                      className="popup-details-link"
                    >
                      View Location Details →
                    </Link>

                  </div>

                </Popup>

              </CircleMarker>
            );
          })}

        </MapContainer>

        {/* MAP LEGEND */}

        <div className="map-legend">

          <div className="map-legend-title">
            RISK LEVEL
          </div>

          <div className="legend-item">
            <span
              style={{
                background: getRiskColor("CRITICAL"),
              }}
            ></span>
            Critical
          </div>

          <div className="legend-item">
            <span
              style={{
                background: getRiskColor("HIGH"),
              }}
            ></span>
            High
          </div>

          <div className="legend-item">
            <span
              style={{
                background: getRiskColor("MODERATE"),
              }}
            ></span>
            Moderate
          </div>

          <div className="legend-item">
            <span
              style={{
                background: getRiskColor("LOW"),
              }}
            ></span>
            Low
          </div>

        </div>

        {/* LAYER CONTROL */}

        <div className="map-layer-control">

          <div className="map-layer-title">
            <Layers size={14} />
            DATA LAYERS
          </div>

          <label>
            <input
              type="checkbox"
              checked={showRainfall}
              onChange={() =>
                setShowRainfall(!showRainfall)
              }
            />

            Rainfall
          </label>

          <label>
            <input
              type="checkbox"
              checked={showSoilMoisture}
              onChange={() =>
                setShowSoilMoisture(!showSoilMoisture)
              }
            />

            Soil Moisture
          </label>

          <label>
            <input
              type="checkbox"
              checked={showSusceptibility}
              onChange={() =>
                setShowSusceptibility(
                  !showSusceptibility
                )
              }
            />

            Historical Susceptibility
          </label>

        </div>

        {/* LOCATION COUNT */}

        <div className="map-location-count">

          <strong>
            {filteredLocations.length}
          </strong>

          <span>
            locations displayed
          </span>

        </div>

      </div>

      {/* RISK SUMMARY */}

      <div className="map-risk-summary">

        <button
          className={
            selectedRisk === "CRITICAL"
              ? "map-summary-item active"
              : "map-summary-item"
          }
          onClick={() =>
            setSelectedRisk(
              selectedRisk === "CRITICAL"
                ? "ALL"
                : "CRITICAL"
            )
          }
        >
          <span
            className="summary-dot"
            style={{
              background: getRiskColor("CRITICAL"),
            }}
          ></span>

          <div>
            <strong>{criticalCount}</strong>
            <span>Critical</span>
          </div>
        </button>

        <button
          className={
            selectedRisk === "HIGH"
              ? "map-summary-item active"
              : "map-summary-item"
          }
          onClick={() =>
            setSelectedRisk(
              selectedRisk === "HIGH"
                ? "ALL"
                : "HIGH"
            )
          }
        >
          <span
            className="summary-dot"
            style={{
              background: getRiskColor("HIGH"),
            }}
          ></span>

          <div>
            <strong>{highCount}</strong>
            <span>High</span>
          </div>
        </button>

        <button
          className={
            selectedRisk === "MODERATE"
              ? "map-summary-item active"
              : "map-summary-item"
          }
          onClick={() =>
            setSelectedRisk(
              selectedRisk === "MODERATE"
                ? "ALL"
                : "MODERATE"
            )
          }
        >
          <span
            className="summary-dot"
            style={{
              background: getRiskColor("MODERATE"),
            }}
          ></span>

          <div>
            <strong>{moderateCount}</strong>
            <span>Moderate</span>
          </div>
        </button>

        <button
          className={
            selectedRisk === "LOW"
              ? "map-summary-item active"
              : "map-summary-item"
          }
          onClick={() =>
            setSelectedRisk(
              selectedRisk === "LOW"
                ? "ALL"
                : "LOW"
            )
          }
        >
          <span
            className="summary-dot"
            style={{
              background: getRiskColor("LOW"),
            }}
          ></span>

          <div>
            <strong>{lowCount}</strong>
            <span>Low</span>
          </div>
        </button>

      </div>

    </div>
  );
}
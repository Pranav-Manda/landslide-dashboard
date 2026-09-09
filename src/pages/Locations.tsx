import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

import { useAppStore } from "../store/appStore";
import { getRiskColor } from "../services/riskEngine";

export default function Locations() {
    const { locations } = useAppStore();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.state.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "ALL" ||
      location.risk.level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <h1>Locations</h1>
          <p>
            Monitored locations across Northeast India
          </p>
        </div>

        <div className="topbar-right">
          <div className="live">
            <span />
            LIVE MONITORING
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Monitored Locations</h2>
            <p>
              Current environmental conditions and risk status
            </p>
          </div>

          <MapPin size={18} />
        </div>

        <div className="location-toolbar">
          <div className="location-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search location or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="locations-table-wrapper">
          <table className="locations-table">
            <thead>
              <tr>
                <th>LOCATION</th>
                <th>STATE</th>
                <th>RISK</th>
                <th>RAINFALL</th>
                <th>SOIL MOISTURE</th>
                <th>SLOPE</th>
                <th>TREND</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredLocations.map((location) => {
                const trend =
                  location.risk.score > location.previousRisk
                    ? "RISING"
                    : location.risk.score < location.previousRisk
                    ? "FALLING"
                    : "STABLE";

                const TrendIcon =
                  trend === "RISING"
                    ? ArrowUp
                    : trend === "FALLING"
                    ? ArrowDown
                    : Minus;

                const riskColor = getRiskColor(
                  location.risk.level
                );

                return (
                  <tr key={location.id}>
                    <td>
                      <strong>{location.name}</strong>
                    </td>

                    <td>{location.state}</td>

                    <td>
                      <span
                        className="location-risk"
                        style={{
                          color: riskColor,
                          borderColor: riskColor,
                        }}
                      >
                        {location.risk.level}
                      </span>
                    </td>

                    <td>{location.rainfall} mm</td>

                    <td>{location.soilMoisture}%</td>

                    <td>{location.slope}°</td>

                    <td>
                      <div
                        className="location-trend"
                        style={{ color: riskColor }}
                      >
                        <TrendIcon size={14} />
                        {trend}
                      </div>
                    </td>

                    <td>
                      <Link
                        to={`/location/${location.id}`}
                        className="view-location"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredLocations.length === 0 && (
            <div className="empty-locations">
              No locations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
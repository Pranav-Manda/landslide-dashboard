import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import RiskMap from "../components/map/RiskMap";
import { useAppStore } from "../store/appStore";
import { getRiskColor } from "../services/riskEngine";

export default function RiskMapPage() {
  const { locations } = useAppStore();

  return (
    <div className="main">

      {/* TOP BAR */}

      <div className="topbar">

        <div>
          <div className="eyebrow">
            GEOSPATIAL MONITORING
          </div>

          <h1>Risk Map</h1>

          <p className="page-subtitle">
            Live estimated landslide risk across monitored
            locations in Northeast India
          </p>
        </div>

        <div className="topbar-status">
          <span className="status-dot"></span>
          LIVE MONITORING
        </div>

      </div>


      {/* MAP */}

      <div className="panel">

        <div className="panel-header">

          <div>
            <h2>
              Live Risk Map
            </h2>

            <p>
              Location-wise risk assessment and environmental
              monitoring
            </p>
          </div>

          <div className="map-location-count">
            <MapPin size={15} />
            {locations.length} Locations
          </div>

        </div>


        <div className="full-risk-map">
          <RiskMap />
        </div>

      </div>


      {/* LOCATION LIST */}

      <div className="panel">

        <div className="panel-header">

          <div>
            <h2>
              Monitored Locations
            </h2>

            <p>
              Current risk status of all monitored locations
            </p>
          </div>

        </div>


        <div className="map-location-list">

          {locations
            .slice()
            .sort(
              (a, b) =>
                b.risk.score - a.risk.score
            )
            .map((location) => (

              <Link
                key={location.id}
                to={`/location/${location.id}`}
                className="map-location-item"
                style={{
                  textDecoration: "none",
                }}
              >

                {/* LOCATION ICON */}

                <div
                  className="map-location-icon"
                  style={{
                    color: getRiskColor(
                      location.risk.level
                    ),
                  }}
                >
                  <MapPin size={18} />
                </div>


                {/* LOCATION INFO */}

                <div className="map-location-info">

                  <strong>
                    {location.name}
                  </strong>

                  <span>
                    {location.state}
                  </span>

                </div>


                {/* ENVIRONMENT */}

                <div className="map-location-metric">

                  <span>
                    Rainfall
                  </span>

                  <strong>
                    {location.rainfall} mm
                  </strong>

                </div>


                <div className="map-location-metric">

                  <span>
                    Soil Moisture
                  </span>

                  <strong>
                    {location.soilMoisture}%
                  </strong>

                </div>


                {/* RISK */}

                <div className="map-location-risk">

                  <strong
                    style={{
                      color: getRiskColor(
                        location.risk.level
                      ),
                    }}
                  >
                    {location.risk.score}
                  </strong>

                  <span>
                    {location.risk.level}
                  </span>

                </div>


              </Link>

            ))}

        </div>

      </div>

    </div>
  );
}
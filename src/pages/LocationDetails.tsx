import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CloudRain,
  Droplets,
  Mountain,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Route,
  Home,
  Building2,
} from "lucide-react";

import { useAppStore } from "../store/appStore";
import {
  getRiskColor,
  getRiskRecommendations,
} from "../services/riskEngine";

export default function LocationDetails() {
  const { id } = useParams();
  const { locations } = useAppStore();

  const location = locations.find(
    (location) => location.id === Number(id)
  );

  if (!location) {
    return (
      <div className="page">
        <h1>Location not found</h1>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const riskColor = getRiskColor(location.risk.level);

  const trend =
    location.risk.score > location.previousRisk
      ? "RISING"
      : location.risk.score < location.previousRisk
      ? "FALLING"
      : "STABLE";

  const TrendIcon =
    trend === "RISING"
      ? TrendingUp
      : trend === "FALLING"
      ? TrendingDown
      : Minus;

  const recommendations = getRiskRecommendations(location.risk.level);

  return (
    <div className="page">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1>{location.name}</h1>

          <p>
            {location.state} • Last updated {location.lastUpdated}
          </p>
        </div>

        <div
          className="risk-badge"
          style={{
            color: riskColor,
            borderColor: riskColor,
          }}
        >
          <AlertTriangle size={16} />
          {location.risk.level}
        </div>
      </div>

      {/* RISK OVERVIEW */}

      <div className="location-overview">
        <div className="risk-score-card">
          <span>CURRENT RISK SCORE</span>

          <strong style={{ color: riskColor }}>
            {location.risk.score}
          </strong>

          <small>/ 100</small>

          <div className="risk-score-bar">
            <div
              style={{
                width: `${location.risk.score}%`,
                background: riskColor,
              }}
            />
          </div>
        </div>

        <div className="detail-card">
          <span>RISK TREND</span>

          <div className="detail-value">
            <TrendIcon size={22} style={{ color: riskColor }} />
            <strong>{trend}</strong>
          </div>

          <small>
            Previous score: {location.previousRisk}
          </small>
        </div>

        <div className="detail-card">
          <span>LOCATION</span>

          <div className="detail-value">
            <Mountain size={22} />
            <strong>{location.name}</strong>
          </div>

          <small>{location.state}</small>
        </div>
      </div>

      {/* ENVIRONMENTAL CONDITIONS */}

      <div className="section-title">
        <h2>Environmental Conditions</h2>
        <p>Current factors contributing to landslide risk</p>
      </div>

      <div className="environment-grid">
        <div className="environment-card">
          <CloudRain size={22} />

          <span>Rainfall</span>

          <strong>{location.rainfall} mm</strong>

          <small>Current rainfall measurement</small>
        </div>

        <div className="environment-card">
          <Droplets size={22} />

          <span>Soil Moisture</span>

          <strong>{location.soilMoisture}%</strong>

          <small>Estimated soil saturation</small>
        </div>

        <div className="environment-card">
          <Mountain size={22} />

          <span>Slope</span>

          <strong>{location.slope}°</strong>

          <small>Terrain slope angle</small>
        </div>

        <div className="environment-card">
          <History size={22} />

          <span>Historical Susceptibility</span>

          <strong>{location.historicalSusceptibility}%</strong>

          <small>Historical landslide susceptibility</small>
        </div>
      </div>

      {/* RISK CONTRIBUTION */}

      <div className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Risk Factor Contribution</h2>
              <p>
                How environmental factors contribute to the current score
              </p>
            </div>
          </div>

          <div className="factor-list">
            <div className="factor">
              <div>
                <span>Rainfall</span>
                <strong>
                  {location.risk.contributions.rainfall.toFixed(1)}
                </strong>
              </div>

              <div className="factor-bar">
                <div
                  style={{
                    width: `${location.risk.contributions.rainfall}%`,
                  }}
                />
              </div>
            </div>

            <div className="factor">
              <div>
                <span>Soil Moisture</span>
                <strong>
                  {location.risk.contributions.soilMoisture.toFixed(1)}
                </strong>
              </div>

              <div className="factor-bar">
                <div
                  style={{
                    width: `${location.risk.contributions.soilMoisture}%`,
                  }}
                />
              </div>
            </div>

            <div className="factor">
              <div>
                <span>Slope</span>
                <strong>
                  {location.risk.contributions.slope.toFixed(1)}
                </strong>
              </div>

              <div className="factor-bar">
                <div
                  style={{
                    width: `${location.risk.contributions.slope}%`,
                  }}
                />
              </div>
            </div>

            <div className="factor">
              <div>
                <span>Historical Susceptibility</span>
                <strong>
                  {location.risk.contributions.historicalSusceptibility.toFixed(
                    1
                  )}
                </strong>
              </div>

              <div className="factor-bar">
                <div
                  style={{
                    width: `${location.risk.contributions.historicalSusceptibility}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI ANALYSIS */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>AI Risk Analysis</h2>
              <p>Automated interpretation of current conditions</p>
            </div>
          </div>

          <div className="ai-analysis">
            <div className="ai-status">
              <ShieldCheck size={20} />

              <strong>
                {location.risk.level} risk conditions detected
              </strong>
            </div>

            <p>
              The current risk assessment for{" "}
              <strong>{location.name}</strong> is{" "}
              <strong>{location.risk.score}/100</strong>.
              Environmental conditions including rainfall,
              soil moisture, terrain slope and historical
              susceptibility are contributing to the assessment.
            </p>

            <div className="ai-note">
              Prototype AI assessment based on environmental risk factors.
            </div>
          </div>
        </div>
      </div>

      {/* POTENTIAL IMPACT */}

      <div className="section-title">
        <h2>Potential Impact</h2>
        <p>Assets and communities within the vulnerable area</p>
      </div>

      <div className="impact-grid">
        <div className="impact-card">
          <Route size={22} />

          <span>Roads</span>

          <strong>{location.roads}</strong>

          <small>Potentially affected road segments</small>
        </div>

        <div className="impact-card">
          <Home size={22} />

          <span>Settlements</span>

          <strong>{location.settlements}</strong>

          <small>Potentially exposed settlements</small>
        </div>

        <div className="impact-card">
          <Building2 size={22} />

          <span>Infrastructure</span>

          <strong>{location.infrastructure}</strong>

          <small>Potentially affected assets</small>
        </div>
      </div>

      {/* RECOMMENDATIONS */}

      <div className="section-title">
        <h2>Recommended Actions</h2>
        <p>Suggested response based on current risk level</p>
      </div>

      <div className="recommendation-panel">
        {recommendations.map((recommendation, index) => (
          <div className="recommendation" key={index}>
            <div className="recommendation-number">
              {index + 1}
            </div>

            <span>{recommendation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
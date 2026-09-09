import { useState } from "react";
import {
  CloudRain,
  Droplets,
  Mountain,
  History,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Brain,
  MapPin,
} from "lucide-react";

import { useAppStore } from "../store/appStore";
import {
  calculateRisk,
  getRiskColor,
  getRiskRecommendations,
} from "../services/riskEngine";

export default function Simulation() {
  // --------------------------------------------------
  // STORE
  // --------------------------------------------------
  const { locations, updateLocationRisk } = useAppStore();


  // --------------------------------------------------
  // SIMULATION INPUTS
  // --------------------------------------------------

  const [rainfall, setRainfall] = useState(78);
  const [soilMoisture, setSoilMoisture] = useState(74);
  const [slope, setSlope] = useState(32);
  const [historicalSusceptibility, setHistoricalSusceptibility] =
    useState(82);

  // --------------------------------------------------
  // SELECTED LOCATION
  // --------------------------------------------------

  const [selectedLocationId, setSelectedLocationId] = useState(
    locations[0]?.id ?? 1
  );

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  // --------------------------------------------------
  // SCENARIO PRESETS
  // --------------------------------------------------

  const scenarios = {
    normal: {
      rainfall: 35,
      soilMoisture: 45,
      slope: 25,
      historicalSusceptibility: 50,
    },

    heavyRainfall: {
      rainfall: 85,
      soilMoisture: 70,
      slope: 30,
      historicalSusceptibility: 65,
    },

    extremeRainfall: {
      rainfall: 120,
      soilMoisture: 88,
      slope: 35,
      historicalSusceptibility: 75,
    },

    worstCase: {
      rainfall: 150,
      soilMoisture: 98,
      slope: 50,
      historicalSusceptibility: 95,
    },
  };

  const applyScenario = (
    scenario: keyof typeof scenarios
  ) => {
    const values = scenarios[scenario];

    setRainfall(values.rainfall);
    setSoilMoisture(values.soilMoisture);
    setSlope(values.slope);
    setHistoricalSusceptibility(
      values.historicalSusceptibility
    );
  };

  // --------------------------------------------------
  // RISK CALCULATION
  // --------------------------------------------------

  const risk = calculateRisk({
    rainfall,
    soilMoisture,
    slope,
    historicalSusceptibility,
  });

  const riskColor = getRiskColor(risk.level);

  const recommendations =
    getRiskRecommendations(risk.level);

  // --------------------------------------------------
  // RISK COMPARISON
  // --------------------------------------------------

  const previousScore =
    selectedLocation?.risk.score ?? risk.score;

  const riskChange =
    risk.score - previousScore;

  const riskChangeLabel =
    riskChange > 0
      ? `+${riskChange}`
      : `${riskChange}`;

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const resetSimulation = () => {
    setRainfall(78);
    setSoilMoisture(74);
    setSlope(32);
    setHistoricalSusceptibility(82);
  };
 const runEarlyWarningCheck = () => {
  if (!selectedLocation) return;

  updateLocationRisk(
    selectedLocation.id,
    rainfall,
    soilMoisture,
    slope,
    historicalSusceptibility
  );
};
  // --------------------------------------------------
  // WARNING
  // --------------------------------------------------

  const isWarning =
    risk.level === "HIGH" ||
    risk.level === "CRITICAL";

  const warningTitle =
    risk.level === "CRITICAL"
      ? "CRITICAL LANDSLIDE RISK"
      : risk.level === "HIGH"
      ? "HIGH LANDSLIDE RISK"
      : risk.level === "MODERATE"
      ? "MODERATE LANDSLIDE RISK"
      : "LOW LANDSLIDE RISK";

  const warningMessage =
    risk.level === "CRITICAL"
      ? "Immediate field assessment and emergency preparedness are recommended."
      : risk.level === "HIGH"
      ? "Increased monitoring and precautionary action are recommended."
      : risk.level === "MODERATE"
      ? "Continue monitoring environmental conditions closely."
      : "Current conditions indicate relatively low landslide risk.";

  // --------------------------------------------------
  // IMPACT ASSESSMENT
  // --------------------------------------------------

  const affectedRoads = selectedLocation
    ? Math.round(
        selectedLocation.roads *
          (risk.score / 100)
      )
    : 0;

  const affectedSettlements = selectedLocation
    ? Math.round(
        selectedLocation.settlements *
          (risk.score / 100)
      )
    : 0;

  const affectedInfrastructure = selectedLocation
    ? Math.round(
        selectedLocation.infrastructure *
          (risk.score / 100)
      )
    : 0;

  const impactLevel =
    risk.level === "CRITICAL"
      ? "Severe"
      : risk.level === "HIGH"
      ? "High"
      : risk.level === "MODERATE"
      ? "Moderate"
      : "Low";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="page">

      {/* -------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------- */}

      <div className="page-header">

        <div>

          <span className="back-link">
            SIMULATION CENTER
          </span>

          <h1>
            Landslide Risk Simulation
          </h1>

          <p>
            Test how environmental conditions affect
            estimated landslide risk.
          </p>

        </div>

        <button
          className="panel-button"
          onClick={resetSimulation}
        >
          <RotateCcw size={14} />
          Reset
        </button>

      </div>


      {/* -------------------------------------------- */}
      {/* LOCATION SELECTOR */}
      {/* -------------------------------------------- */}

      <div className="panel simulation-location-panel">

        <div className="panel-header">

          <div>

            <h2>
              Simulation Location
            </h2>

            <p>
              Select a monitored location for the
              simulation
            </p>

          </div>

        </div>

        <div className="simulation-control">

          <select
            value={selectedLocationId}
            onChange={(e) =>
              setSelectedLocationId(
                Number(e.target.value)
              )
            }
            className="simulation-select"
          >

            {locations.map((location) => (
              <option
                key={location.id}
                value={location.id}
              >
                {location.name} — {location.state}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* -------------------------------------------- */}
      {/* EARLY WARNING CARD */}
      {/* -------------------------------------------- */}

      <div
        className={`simulation-warning ${
          risk.level === "CRITICAL"
            ? "warning-critical"
            : risk.level === "HIGH"
            ? "warning-high"
            : risk.level === "MODERATE"
            ? "warning-moderate"
            : "warning-low"
        }`}
      >

        <div className="warning-header">

          {risk.level === "CRITICAL" ||
          risk.level === "HIGH" ? (
            <AlertTriangle size={20} />
          ) : (
            <ShieldCheck size={20} />
          )}

          <div>

            <h3>
              {warningTitle}
            </h3>

            <span>
              AI Early Warning Assessment
            </span>

          </div>

        </div>

        <p>
          {warningMessage}
        </p>

        <div className="warning-location">

          <MapPin size={15} />

          <span>

            {selectedLocation?.name ??
              "Selected Location"}

            {selectedLocation
              ? ` — ${selectedLocation.state}`
              : ""}

          </span>

        </div>

      </div>


      {/* -------------------------------------------- */}
      {/* OLD HIGH/CRITICAL WARNING */}
      {/* -------------------------------------------- */}

      {isWarning && (

        <div
          className={`warning-banner ${
            risk.level === "CRITICAL"
              ? "warning-critical"
              : "warning-high"
          }`}
        >

          <div className="warning-icon">

            {risk.level === "CRITICAL" ? (
              <AlertTriangle size={22} />
            ) : (
              <Bell size={22} />
            )}

          </div>

          <div className="warning-content">

            <strong>

              {risk.level === "CRITICAL"
                ? "CRITICAL EARLY WARNING"
                : "HIGH RISK WARNING"}

            </strong>

            <p>
              Environmental conditions indicate
              an elevated landslide risk. Enhanced
              monitoring and precautionary action
              are recommended.
            </p>

          </div>

          <div className="warning-score">
            {risk.score}/100
          </div>

        </div>

      )}


      {/* -------------------------------------------- */}
      {/* SCENARIO PRESETS */}
      {/* -------------------------------------------- */}

      <div className="panel scenario-panel">

        <div className="panel-header">

          <div>

            <h2>
              Scenario Presets
            </h2>

            <p>
              Quickly test predefined environmental
              conditions
            </p>

          </div>

        </div>

        <div className="scenario-buttons">

          <button
            onClick={() =>
              applyScenario("normal")
            }
          >
            Normal
          </button>

          <button
            onClick={() =>
              applyScenario("heavyRainfall")
            }
          >
            Heavy Rainfall
          </button>

          <button
            onClick={() =>
              applyScenario("extremeRainfall")
            }
          >
            Extreme Rainfall
          </button>

          <button
            onClick={() =>
              applyScenario("worstCase")
            }
          >
            Worst Case
          </button>
            <button
  className="run-warning-button"
  onClick={runEarlyWarningCheck}
>
  <Bell size={15} />
  Run Early Warning Check
</button>
        </div>

      </div>

            {/* -------------------------------------------- */}
{/* GENERATED ALERT */}
{/* -------------------------------------------- */}


      {/* -------------------------------------------- */}
      {/* MAIN SIMULATION GRID */}
      {/* -------------------------------------------- */}

      <div className="simulation-grid">


        {/* ------------------------------------------ */}
        {/* INPUTS */}
        {/* ------------------------------------------ */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Environmental Inputs
              </h2>

              <p>
                Adjust conditions to simulate
                different scenarios
              </p>

            </div>

          </div>


          <div className="simulation-controls">


            {/* RAINFALL */}

            <div className="simulation-control">

              <div className="simulation-control-header">

                <div>
                  <CloudRain size={18} />
                  <span>
                    Rainfall
                  </span>
                </div>

                <strong>
                  {rainfall} mm
                </strong>

              </div>

              <input
                type="range"
                min="0"
                max="150"
                value={rainfall}
                onChange={(e) =>
                  setRainfall(
                    Number(e.target.value)
                  )
                }
              />

              <div className="range-labels">

                <span>
                  0 mm
                </span>

                <span>
                  150 mm
                </span>

              </div>

            </div>


            {/* SOIL MOISTURE */}

            <div className="simulation-control">

              <div className="simulation-control-header">

                <div>
                  <Droplets size={18} />
                  <span>
                    Soil Moisture
                  </span>
                </div>

                <strong>
                  {soilMoisture}%
                </strong>

              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) =>
                  setSoilMoisture(
                    Number(e.target.value)
                  )
                }
              />

              <div className="range-labels">

                <span>
                  0%
                </span>

                <span>
                  100%
                </span>

              </div>

            </div>


            {/* SLOPE */}

            <div className="simulation-control">

              <div className="simulation-control-header">

                <div>
                  <Mountain size={18} />
                  <span>
                    Slope
                  </span>
                </div>

                <strong>
                  {slope}°
                </strong>

              </div>

              <input
                type="range"
                min="0"
                max="60"
                value={slope}
                onChange={(e) =>
                  setSlope(
                    Number(e.target.value)
                  )
                }
              />

              <div className="range-labels">

                <span>
                  0°
                </span>

                <span>
                  60°
                </span>

              </div>

            </div>


            {/* HISTORICAL SUSCEPTIBILITY */}

            <div className="simulation-control">

              <div className="simulation-control-header">

                <div>

                  <History size={18} />

                  <span>
                    Historical Susceptibility
                  </span>

                </div>

                <strong>
                  {historicalSusceptibility}%
                </strong>

              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={historicalSusceptibility}
                onChange={(e) =>
                  setHistoricalSusceptibility(
                    Number(e.target.value)
                  )
                }
              />

              <div className="range-labels">

                <span>
                  0%
                </span>

                <span>
                  100%
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ------------------------------------------ */}
        {/* RESULT */}
        {/* ------------------------------------------ */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Simulation Result
              </h2>

              <p>
                Estimated risk based on current
                inputs
              </p>

            </div>

          </div>


          <div className="simulation-result">

            <span className="simulation-label">
              CURRENT RISK SCORE
            </span>


            {/* RISK COMPARISON */}

            <div className="risk-comparison">

              <div className="comparison-item">

                <span>
                  Previous Risk
                </span>

                <strong>
                  {previousScore}/100
                </strong>

              </div>


              <div className="comparison-arrow">
                →
              </div>


              <div className="comparison-item">

                <span>
                  Simulated Risk
                </span>

                <strong>
                  {risk.score}/100
                </strong>

              </div>


              <div
                className={`risk-change ${
                  riskChange > 0
                    ? "risk-increase"
                    : riskChange < 0
                    ? "risk-decrease"
                    : "risk-neutral"
                }`}
              >
                {riskChangeLabel}
              </div>

            </div>


            {/* SCORE */}

            <strong
              className="simulation-score"
              style={{
                color: riskColor,
              }}
            >
              {risk.score}
            </strong>

            <span className="simulation-max">
              / 100
            </span>


            {/* LEVEL */}

            <div
              className="simulation-level"
              style={{
                color: riskColor,
                borderColor: riskColor,
              }}
            >

              <AlertTriangle size={16} />

              {risk.level}

            </div>


            {/* SCORE BAR */}

            <div className="risk-score-bar">

              <div
                style={{
                  width: `${risk.score}%`,
                  background: riskColor,
                }}
              />

            </div>


            <div className="simulation-message">

              Risk is calculated using rainfall,
              soil moisture, terrain slope and
              historical susceptibility.

            </div>

          </div>

        </div>

      </div>


      {/* -------------------------------------------- */}
      {/* AI INTERPRETATION */}
      {/* -------------------------------------------- */}

      <div className="section-title">

        <h2>
          AI Early Warning Assessment
        </h2>

        <p>
          Automated interpretation of the
          simulated environmental conditions
        </p>

      </div>


      <div className="ai-warning-panel">

        <div className="ai-warning-icon">

          {risk.level === "LOW" ? (
            <ShieldCheck size={22} />
          ) : (
            <AlertTriangle size={22} />
          )}

        </div>


        <div>

          <strong>

            {risk.level === "LOW"
              ? "No immediate warning condition"
              : risk.level === "MODERATE"
              ? "Increased monitoring recommended"
              : risk.level === "HIGH"
              ? "Precautionary warning recommended"
              : "Immediate response preparation recommended"}

          </strong>


          <p>

            Current simulated conditions produce
            a landslide risk score of{" "}

            <strong>
              {risk.score}/100
            </strong>

            . The system evaluates multiple
            environmental factors rather than
            relying on rainfall alone.

          </p>

        </div>

      </div>


      {/* -------------------------------------------- */}
      {/* AI FACTOR ANALYSIS */}
      {/* -------------------------------------------- */}

      <div className="ai-analysis-box">

        <div className="ai-analysis-header">

          <Brain size={18} />

          <div>

            <h3>
              AI Risk Analysis
            </h3>

            <span>
              Environmental factor assessment
            </span>

          </div>

        </div>


        <p>

          The simulated risk is based on the
          combined influence of rainfall, soil
          moisture, terrain slope, and historical
          landslide susceptibility.

        </p>


        <div className="ai-factors">

          <div>

            <span>
              Rainfall
            </span>

            <strong>
              {rainfall} mm
            </strong>

          </div>


          <div>

            <span>
              Soil Moisture
            </span>

            <strong>
              {soilMoisture}%
            </strong>

          </div>


          <div>

            <span>
              Slope
            </span>

            <strong>
              {slope}°
            </strong>

          </div>


          <div>

            <span>
              Historical Susceptibility
            </span>

            <strong>
              {historicalSusceptibility}%
            </strong>

          </div>

        </div>

      </div>


      {/* -------------------------------------------- */}
      {/* IMPACT ASSESSMENT */}
      {/* -------------------------------------------- */}

      <div className="section-title">

        <h2>
          Impact Assessment
        </h2>

        <p>
          Estimated exposure based on the
          simulated risk level
        </p>

      </div>


      <div className="impact-assessment">

        <div className="impact-header">

          <div>

            <h3>
              Potential Impact
            </h3>

            <span>
              Estimated exposure if current
              conditions persist
            </span>

          </div>


          <strong
            className={`impact-level impact-${risk.level.toLowerCase()}`}
          >
            {impactLevel}
          </strong>

        </div>


        <div className="impact-grid">


          {/* ROADS */}

          <div className="impact-card">

            <MapPin size={18} />

            <span>
              Potentially Affected Roads
            </span>

            <strong>
              {affectedRoads}
            </strong>

          </div>


          {/* SETTLEMENTS */}

          <div className="impact-card">

            <ShieldAlert size={18} />

            <span>
              Potentially Affected Settlements
            </span>

            <strong>
              {affectedSettlements}
            </strong>

          </div>


          {/* INFRASTRUCTURE */}

          <div className="impact-card">

            <Mountain size={18} />

            <span>
              Potentially Affected Infrastructure
            </span>

            <strong>
              {affectedInfrastructure}
            </strong>

          </div>

        </div>


        <p className="impact-note">

          These values are prototype estimates
          calculated from the simulated risk score
          and the selected location's exposure data.

        </p>

      </div>


      {/* -------------------------------------------- */}
      {/* RECOMMENDATIONS */}
      {/* -------------------------------------------- */}

      <div className="section-title">

        <h2>
          Recommended Actions
        </h2>

        <p>
          Actions suggested for the simulated
          risk level
        </p>

      </div>


      <div className="recommendation-panel">

        {recommendations.map(
          (recommendation, index) => (

            <div
              className="recommendation"
              key={index}
            >

              <div className="recommendation-number">
                {index + 1}
              </div>

              <span>
                {recommendation}
              </span>

            </div>

          )
        )}

      </div>

    </div>
  );
}
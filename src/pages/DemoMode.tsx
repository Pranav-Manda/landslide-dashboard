import { useState } from "react";
import { Play, RotateCcw, CheckCircle2 } from "lucide-react";
import { useAppStore } from "../store/appStore";

export default function DemoMode() {
  const { locations, updateLocationRisk } = useAppStore();

  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const eastSikkim = locations.find(
    (location) => location.name === "East Sikkim"
  );

  const runDemo = () => {
    if (!eastSikkim) return;

    setRunning(true);
    setStep(1);

    // Stage 1 — rainfall begins increasing
    updateLocationRisk(
      eastSikkim.id,
      78,
      74,
      32,
      82
    );

    setTimeout(() => {
      setStep(2);

      // Stage 2 — conditions worsen
      updateLocationRisk(
        eastSikkim.id,
        100,
        86,
        38,
        82
      );
    }, 1500);

    setTimeout(() => {
      setStep(3);

      // Stage 3 — critical conditions
      updateLocationRisk(
        eastSikkim.id,
        125,
        95,
        45,
        90
      );
    }, 3000);

    setTimeout(() => {
      setStep(4);
      setRunning(false);
    }, 4500);
  };

  const resetDemo = () => {
    if (!eastSikkim) return;

    updateLocationRisk(
      eastSikkim.id,
      45,
      48,
      25,
      60
    );

    setStep(0);
    setRunning(false);
  };

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <div className="eyebrow">LANDWATCH • DEMONSTRATION</div>
          <h1>Demo Mode</h1>
          <p>
            Simulate a developing landslide-risk event across the
            monitoring system.
          </p>
        </div>
      </div>

      <div className="demo-panel">
        <div className="demo-intro">
          <div>
            <h2>East Sikkim Risk Escalation</h2>
            <p>
              This scenario demonstrates how changing environmental
              conditions can increase estimated landslide risk.
            </p>
          </div>

          <div className="demo-controls">
            <button
              className="demo-run-button"
              onClick={runDemo}
              disabled={running}
            >
              <Play size={17} />
              {running ? "Running Scenario..." : "Run Demo Scenario"}
            </button>

            <button
              className="demo-reset-button"
              onClick={resetDemo}
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        </div>

        <div className="demo-timeline">
          <div className={`demo-step ${step >= 1 ? "active" : ""}`}>
            <div className="demo-step-number">1</div>
            <div>
              <strong>Initial Conditions</strong>
              <span>Moderate environmental stress</span>
            </div>
          </div>

          <div className={`demo-step ${step >= 2 ? "active" : ""}`}>
            <div className="demo-step-number">2</div>
            <div>
              <strong>Risk Increasing</strong>
              <span>Rainfall and soil moisture rise</span>
            </div>
          </div>

          <div className={`demo-step ${step >= 3 ? "active" : ""}`}>
            <div className="demo-step-number">3</div>
            <div>
              <strong>Critical Conditions</strong>
              <span>Risk reaches critical threshold</span>
            </div>
          </div>

          <div className={`demo-step ${step >= 4 ? "active" : ""}`}>
            <div className="demo-step-number">
              <CheckCircle2 size={17} />
            </div>
            <div>
              <strong>Warning Generated</strong>
              <span>System-wide response demonstrated</span>
            </div>
          </div>
        </div>

        {eastSikkim && (
          <div className="demo-live-state">
            <div className="demo-live-header">
              <span>LIVE SCENARIO STATE</span>
              <span>East Sikkim</span>
            </div>

            <div className="demo-metrics">
              <div>
                <span>Rainfall</span>
                <strong>{eastSikkim.rainfall} mm</strong>
              </div>

              <div>
                <span>Soil Moisture</span>
                <strong>{eastSikkim.soilMoisture}%</strong>
              </div>

              <div>
                <span>Slope</span>
                <strong>{eastSikkim.slope}°</strong>
              </div>

              <div>
                <span>Risk Score</span>
                <strong>{eastSikkim.risk.score}/100</strong>
              </div>

              <div>
                <span>Risk Level</span>
                <strong>{eastSikkim.risk.level}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="demo-flow-panel">
        <h3>System Response</h3>

        <div className="demo-flow">
          <span>Environmental Data</span>
          <b>→</b>
          <span>Risk Engine</span>
          <b>→</b>
          <span>Risk Assessment</span>
          <b>→</b>
          <span>Alert Center</span>
          <b>→</b>
          <span>Public Warning</span>
        </div>

        <p>
          All values shown in Demo Mode are simulated prototype data.
          They are intended to demonstrate system behaviour and are
          not real-world forecasts.
        </p>
      </div>
    </div>
  );
}
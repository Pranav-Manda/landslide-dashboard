import { useState } from "react";
import { Bell, ShieldAlert } from "lucide-react";

export default function Settings() {
  const [criticalThreshold, setCriticalThreshold] = useState(81);
  const [highThreshold, setHighThreshold] = useState(61);
  const [moderateThreshold, setModerateThreshold] = useState(31);

  const [alertsEnabled, setAlertsEnabled] = useState(true);

  return (
    <div className="main">
      <div className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Configure monitoring and early-warning thresholds</p>
        </div>

        <div className="topbar-right">
          <div className="live">
            <span />
            SYSTEM CONFIGURATION
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Risk Thresholds</h2>
              <p>
                Define the risk levels used by the monitoring system
              </p>
            </div>

            <ShieldAlert size={18} />
          </div>

          <div className="settings-section">
            <label>
              <span>CRITICAL THRESHOLD</span>
              <strong>{criticalThreshold}</strong>
            </label>

            <input
              type="range"
              min="70"
              max="100"
              value={criticalThreshold}
              onChange={(e) =>
                setCriticalThreshold(Number(e.target.value))
              }
            />

            <small>
              Scores at or above this value trigger critical warnings.
            </small>
          </div>

          <div className="settings-section">
            <label>
              <span>HIGH RISK THRESHOLD</span>
              <strong>{highThreshold}</strong>
            </label>

            <input
              type="range"
              min="40"
              max="80"
              value={highThreshold}
              onChange={(e) =>
                setHighThreshold(Number(e.target.value))
              }
            />

            <small>
              Scores at or above this value are classified as high risk.
            </small>
          </div>

          <div className="settings-section">
            <label>
              <span>MODERATE RISK THRESHOLD</span>
              <strong>{moderateThreshold}</strong>
            </label>

            <input
              type="range"
              min="10"
              max="60"
              value={moderateThreshold}
              onChange={(e) =>
                setModerateThreshold(Number(e.target.value))
              }
            />

            <small>
              Scores at or above this value are classified as moderate risk.
            </small>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Alert Configuration</h2>
              <p>Control automated warning notifications</p>
            </div>

            <Bell size={18} />
          </div>

          <div className="settings-toggle">
            <div>
              <strong>Automated Alerts</strong>
              <small>
                Generate warnings when risk levels increase
              </small>
            </div>

            <button
              className={alertsEnabled ? "toggle active" : "toggle"}
              onClick={() => setAlertsEnabled(!alertsEnabled)}
            >
              <span />
            </button>
          </div>

          <div className="settings-info">
            <span>Current Configuration</span>

            <div>
              <strong>0–{moderateThreshold - 1}</strong>
              <span>LOW</span>
            </div>

            <div>
              <strong>
                {moderateThreshold}–{highThreshold - 1}
              </strong>
              <span>MODERATE</span>
            </div>

            <div>
              <strong>
                {highThreshold}–{criticalThreshold - 1}
              </strong>
              <span>HIGH</span>
            </div>

            <div>
              <strong>{criticalThreshold}–100</strong>
              <span>CRITICAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { AlertTriangle, MapPin, ShieldAlert, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function PublicWarning() {
  const { alerts } = useAppStore();

  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status === "ACTIVE" &&
      (alert.level === "HIGH" || alert.level === "CRITICAL")
  );

  const criticalAlerts = activeAlerts.filter(
    (alert) => alert.level === "CRITICAL"
  );

  const highestAlert =
    criticalAlerts[0] || activeAlerts[0] || null;

  return (
    <div className="public-warning-page">
      <div className="public-warning-header">
        <div>
          <div className="eyebrow">LANDWATCH • PUBLIC SAFETY</div>
          <h1>Early Warning System</h1>
          <p>
            Real-time landslide risk information for communities and
            emergency responders.
          </p>
        </div>

        <Link to="/" className="back-dashboard-link">
          Command Dashboard
        </Link>
      </div>

      {highestAlert ? (
        <div
          className={`warning-main ${
            highestAlert.level === "CRITICAL"
              ? "warning-critical"
              : "warning-high"
          }`}
        >
          <div className="warning-icon">
            <AlertTriangle size={42} />
          </div>

          <div className="warning-content">
            <div className="warning-level">
              {highestAlert.level} RISK
            </div>

            <h2>
              Landslide Risk Alert — {highestAlert.locationName}
            </h2>

            <p className="warning-state">
              <MapPin size={17} />
              {highestAlert.state}
            </p>

            <p className="warning-message">
              {highestAlert.message}
            </p>

            <div className="warning-score">
              <span>Risk Score</span>
              <strong>{highestAlert.score}/100</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="warning-clear">
          <ShieldAlert size={48} />

          <h2>No Active Landslide Warning</h2>

          <p>
            Current monitored locations are not showing an active
            high or critical landslide warning.
          </p>

          <div className="clear-status">
            <span className="status-dot" />
            Monitoring system active
          </div>
        </div>
      )}

      {activeAlerts.length > 0 && (
        <div className="public-alert-list">
          <div className="public-section-title">
            <h3>Active Regional Warnings</h3>
            <span>{activeAlerts.length} active</span>
          </div>

          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`public-alert-item ${
                alert.level === "CRITICAL"
                  ? "public-alert-critical"
                  : "public-alert-high"
              }`}
            >
              <div className="public-alert-icon">
                <AlertTriangle size={20} />
              </div>

              <div className="public-alert-info">
                <strong>
                  {alert.locationName}, {alert.state}
                </strong>

                <span>
                  {alert.level} risk • Score {alert.score}/100
                </span>

                <p>{alert.message}</p>
              </div>

              <div className="public-alert-time">
                <Clock size={14} />
                {alert.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="public-safety-panel">
        <h3>Recommended Safety Actions</h3>

        <div className="safety-actions">
          <div>
            <strong>01</strong>
            <span>Stay away from unstable slopes and landslide-prone areas.</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Follow instructions issued by local authorities.</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Keep emergency routes and communication channels clear.</span>
          </div>

          <div>
            <strong>04</strong>
            <span>Move to a safer location if an official evacuation order is issued.</span>
          </div>
        </div>
      </div>

      <div className="public-warning-footer">
        <span>LANDWATCH</span>
        <span>AI-Based Early Warning & Landslide Risk Monitoring</span>
        <span>Prototype • Demonstration System</span>
      </div>
    </div>
  );
}
import { useEffect } from "react";
import {
  Activity,
  Bell,
  Brain,
  ChevronRight,
  CloudRain,
  Gauge,
  MapPin,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

import RiskMap from "../components/map/RiskMap";
import { useAppStore } from "../store/appStore";
import { fetchLocations } from "../services/locationservice";

export default function Dashboard() {
  const { locations, alerts } = useAppStore();

  // Test Supabase connection
  useEffect(() => {
     console.log("🔥 DASHBOARD TEST RUNNING");
    fetchLocations();
  }, []);

  const criticalLocations = locations.filter(
    (location) => location.risk.level === "CRITICAL"
  );

  const highRiskLocations = locations.filter(
    (location) => location.risk.level === "HIGH"
  );

  const moderateLocations = locations.filter(
    (location) => location.risk.level === "MODERATE"
  );

  const lowRiskLocations = locations.filter(
    (location) => location.risk.level === "LOW"
  );

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "ACTIVE"
  );

  const averageRisk =
    locations.length > 0
      ? Math.round(
          locations.reduce(
            (sum, location) => sum + location.risk.score,
            0
          ) / locations.length
        )
      : 0;

  const highestRiskLocations = [...locations]
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, 5);

  return (
    <div className="app dashboard-page">
      <main className="main">

        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              LANDWATCH / COMMAND CENTER
            </div>

            <h1>Dashboard</h1>

            <p className="page-subtitle">
              AI-based landslide risk monitoring and early warning
            </p>
          </div>

          <div className="topbar-actions">
            <div className="live-status">
              <span className="status-dot"></span>
              SYSTEM ONLINE
            </div>

            <Link
              to="/alerts"
              className="notification"
              title="Alert Center"
            >
              <Bell size={19} />

              {activeAlerts.length > 0 && (
                <span className="notification-badge">
                  {activeAlerts.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon critical">
              <ShieldAlert size={21} />
            </div>

            <div className="stat-content">
              <span className="stat-label">CRITICAL</span>
              <strong>{criticalLocations.length}</strong>
              <span className="stat-description">
                locations requiring attention
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon high">
              <TrendingUp size={21} />
            </div>

            <div className="stat-content">
              <span className="stat-label">HIGH RISK</span>
              <strong>{highRiskLocations.length}</strong>
              <span className="stat-description">
                locations under watch
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon moderate">
              <Activity size={21} />
            </div>

            <div className="stat-content">
              <span className="stat-label">MODERATE</span>
              <strong>{moderateLocations.length}</strong>
              <span className="stat-description">
                locations being monitored
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon neutral">
              <Gauge size={21} />
            </div>

            <div className="stat-content">
              <span className="stat-label">AVERAGE RISK</span>
              <strong>{averageRisk}%</strong>
              <span className="stat-description">
                across monitored locations
              </span>
            </div>
          </div>

        </section>

        {/* ACTIVE ALERT */}
        {activeAlerts.length > 0 && (
          <section className="alert-banner">

            <div className="alert-banner-icon">
              <ShieldAlert size={22} />
            </div>

            <div className="alert-banner-content">
              <strong>Active Early Warning</strong>

              <span>
                {activeAlerts.length} active alert
                {activeAlerts.length !== 1 ? "s" : ""} require
                attention.
              </span>
            </div>

            <Link
              to="/alerts"
              className="alert-banner-link"
            >
              View alerts
              <ChevronRight size={17} />
            </Link>

          </section>
        )}

        {/* MAP + RISK DISTRIBUTION */}
        <section className="dashboard-grid">

          {/* MAP */}
          <div className="panel map-panel">

            <div className="panel-header">

              <div>
                <div className="panel-title">
                  <MapPin size={17} />
                  Live Risk Map
                </div>

                <div className="panel-subtitle">
                  Northeast India monitoring network
                </div>
              </div>

              <Link
                to="/map"
                className="panel-action"
              >
                View Full Map
                <ChevronRight size={15} />
              </Link>

            </div>

            <div className="dashboard-map">
              <RiskMap />
            </div>

          </div>

          {/* RISK DISTRIBUTION */}
          <div className="panel">

            <div className="panel-header">

              <div>
                <div className="panel-title">
                  <Gauge size={17} />
                  Risk Distribution
                </div>

                <div className="panel-subtitle">
                  Current location classification
                </div>
              </div>

            </div>

            <div className="risk-distribution">

              <div className="risk-row">
                <div className="risk-row-label">
                  <span className="risk-dot critical-dot"></span>
                  Critical
                  <strong>{criticalLocations.length}</strong>
                </div>

                <div className="risk-bar">
                  <div
                    className="risk-bar-fill critical-fill"
                    style={{
                      width: `${
                        locations.length
                          ? (criticalLocations.length /
                              locations.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="risk-row">
                <div className="risk-row-label">
                  <span className="risk-dot high-dot"></span>
                  High
                  <strong>{highRiskLocations.length}</strong>
                </div>

                <div className="risk-bar">
                  <div
                    className="risk-bar-fill high-fill"
                    style={{
                      width: `${
                        locations.length
                          ? (highRiskLocations.length /
                              locations.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="risk-row">
                <div className="risk-row-label">
                  <span className="risk-dot moderate-dot"></span>
                  Moderate
                  <strong>{moderateLocations.length}</strong>
                </div>

                <div className="risk-bar">
                  <div
                    className="risk-bar-fill moderate-fill"
                    style={{
                      width: `${
                        locations.length
                          ? (moderateLocations.length /
                              locations.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="risk-row">
                <div className="risk-row-label">
                  <span className="risk-dot low-dot"></span>
                  Low
                  <strong>{lowRiskLocations.length}</strong>
                </div>

                <div className="risk-bar">
                  <div
                    className="risk-bar-fill low-fill"
                    style={{
                      width: `${
                        locations.length
                          ? (lowRiskLocations.length /
                              locations.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* HIGHEST RISK + AI */}
        <section className="dashboard-grid">

          {/* HIGHEST RISK */}
          <div className="panel">

            <div className="panel-header">

              <div>
                <div className="panel-title">
                  <ShieldAlert size={17} />
                  Highest Risk Locations
                </div>

                <div className="panel-subtitle">
                  Locations requiring closest monitoring
                </div>
              </div>

              <Link
                to="/locations"
                className="panel-action"
              >
                View All
                <ChevronRight size={15} />
              </Link>

            </div>

            <div className="risk-location-list">

              {highestRiskLocations.map((location) => (
                <Link
                  key={location.id}
                  to={`/location/${location.id}`}
                  className="risk-location-item"
                >

                  <div className="location-main">

                    <div className="location-icon">
                      <MapPin size={16} />
                    </div>

                    <div>
                      <strong>{location.name}</strong>
                      <span>{location.state}</span>
                    </div>

                  </div>

                  <div className="location-risk">

                    <strong>
                      {location.risk.score}%
                    </strong>

                    <span
                      className={`risk-level ${location.risk.level.toLowerCase()}`}
                    >
                      {location.risk.level}
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          </div>

          {/* AI SUMMARY */}
          <div className="panel ai-panel">

            <div className="panel-header">

              <div>
                <div className="panel-title">
                  <Brain size={17} />
                  AI Risk Summary
                </div>

                <div className="panel-subtitle">
                  Automated environmental assessment
                </div>
              </div>

            </div>

            <div className="ai-summary">

              <div className="ai-summary-icon">
                <Brain size={25} />
              </div>

              <p>
                Current monitoring indicates{" "}
                <strong>
                  {criticalLocations.length +
                    highRiskLocations.length}{" "}
                  high-priority locations
                </strong>{" "}
                across the Northeast region.
              </p>

              <p>
                Environmental conditions including rainfall,
                soil moisture, slope characteristics and
                historical susceptibility are being evaluated
                to estimate landslide risk.
              </p>

              <p>
                {criticalLocations.length > 0
                  ? "Critical-risk locations require immediate attention and continuous monitoring."
                  : "No locations are currently classified as critical. Continue routine monitoring of changing environmental conditions."}
              </p>

              <Link
                to="/analytics"
                className="ai-link"
              >
                Open AI Analysis
                <ChevronRight size={15} />
              </Link>

            </div>

          </div>

        </section>

        {/* MONITORING OVERVIEW */}
        <section className="panel">

          <div className="panel-header">

            <div>
              <div className="panel-title">
                <CloudRain size={17} />
                Monitoring Overview
              </div>

              <div className="panel-subtitle">
                Current environmental monitoring coverage
              </div>
            </div>

          </div>

          <div className="overview-grid">

            <div className="overview-item">
              <span>MONITORED LOCATIONS</span>
              <strong>{locations.length}</strong>
            </div>

            <div className="overview-item">
              <span>ACTIVE ALERTS</span>
              <strong>{activeAlerts.length}</strong>
            </div>

            <div className="overview-item">
              <span>LOW RISK</span>
              <strong>{lowRiskLocations.length}</strong>
            </div>

            <div className="overview-item">
              <span>SYSTEM STATUS</span>
              <strong className="online-text">
                ONLINE
              </strong>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
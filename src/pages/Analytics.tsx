import {
  Activity,
  AlertTriangle,
  Brain,
  CloudRain,
  Droplets,
  Mountain,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAppStore } from "../store/appStore";

export default function Analytics() {
    const { locations } = useAppStore();
  const riskDistribution = [
    {
      name: "Low",
      value: locations.filter((l) => l.risk.level === "LOW").length,
    },
    {
      name: "Moderate",
      value: locations.filter((l) => l.risk.level === "MODERATE").length,
    },
    {
      name: "High",
      value: locations.filter((l) => l.risk.level === "HIGH").length,
    },
    {
      name: "Critical",
      value: locations.filter((l) => l.risk.level === "CRITICAL").length,
    },
  ];

  const rainfallRiskData = locations.map((location) => ({
    name: location.name,
    rainfall: location.rainfall,
    risk: location.risk.score,
  }));

  const soilRiskData = locations.map((location) => ({
    name: location.name,
    soil: location.soilMoisture,
    risk: location.risk.score,
  }));

  const riskTrendData = locations.map((location) => ({
    name: location.name,
    previous: location.previousRisk,
    current: location.risk.score,
  }));

  const topRiskLocations = [...locations]
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, 5);

  const criticalCount = locations.filter(
    (l) => l.risk.level === "CRITICAL"
  ).length;

  const highCount = locations.filter(
    (l) => l.risk.level === "HIGH"
  ).length;

  const averageRisk =
    locations.reduce((sum, location) => sum + location.risk.score, 0) /
    locations.length;

  const averageRainfall =
    locations.reduce((sum, location) => sum + location.rainfall, 0) /
    locations.length;

  const averageSoil =
    locations.reduce(
      (sum, location) => sum + location.soilMoisture,
      0
    ) / locations.length;

  const getRiskColor = (level: string) => {
    if (level === "CRITICAL") return "#b86d6d";
    if (level === "HIGH") return "#b38a58";
    if (level === "MODERATE") return "#a99b61";
    return "#6f9b78";
  };

  const pieColors = [
    "#6f9b78",
    "#a99b61",
    "#b38a58",
    "#b86d6d",
  ];

  return (
    <div className="main">
      {/* TOP BAR */}

      <div className="topbar">
        <div>
          <div className="eyebrow">SYSTEM ANALYTICS</div>

          <h1>Advanced Analytics</h1>

          <p className="page-subtitle">
            Environmental trends, risk patterns and AI-assisted
            insights across monitored locations
          </p>
        </div>

        <div className="topbar-status">
          <span className="status-dot"></span>
          Analytics Active
        </div>
      </div>

      {/* SUMMARY METRICS */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon warning">
            <Activity size={20} />
          </div>

          <div>
            <span className="stat-label">AVERAGE RISK</span>

            <strong>{averageRisk.toFixed(1)}</strong>

            <small>Across monitored locations</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon critical">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span className="stat-label">HIGH / CRITICAL</span>

            <strong>{highCount + criticalCount}</strong>

            <small>Locations requiring attention</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CloudRain size={20} />
          </div>

          <div>
            <span className="stat-label">AVG RAINFALL</span>

            <strong>{averageRainfall.toFixed(1)}</strong>

            <small>mm across locations</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Droplets size={20} />
          </div>

          <div>
            <span className="stat-label">AVG SOIL MOISTURE</span>

            <strong>{averageSoil.toFixed(1)}%</strong>

            <small>Current monitored average</small>
          </div>
        </div>
      </div>

      {/* RISK TREND + DISTRIBUTION */}

      <div className="analytics-grid">
        <div className="panel analytics-large">
          <div className="panel-header">
            <div>
              <h2>Risk Trend Comparison</h2>

              <p>
                Previous risk score compared with current assessment
              </p>
            </div>

            <TrendingUp size={18} />
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={riskTrendData}>
                <CartesianGrid
                  stroke="#2a2e33"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#70757b"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={70}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#70757b"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#181b1f",
                    border: "1px solid #343a40",
                    color: "#f1f3f5",
                  }}
                />

                <Bar
                  dataKey="previous"
                  name="Previous Risk"
                  fill="#555b61"
                  radius={[2, 2, 0, 0]}
                />

                <Bar
                  dataKey="current"
                  name="Current Risk"
                  fill="#a99b61"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel analytics-small">
          <div className="panel-header">
            <div>
              <h2>Risk Distribution</h2>

              <p>Current locations by severity</p>
            </div>
          </div>

          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {riskDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#181b1f",
                    border: "1px solid #343a40",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="risk-distribution-legend">
              {riskDistribution.map((item, index) => (
                <div
                  key={item.name}
                  className="distribution-item"
                >
                  <span
                    className="distribution-dot"
                    style={{
                      background: pieColors[index],
                    }}
                  ></span>

                  <span>{item.name}</span>

                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RAINFALL VS RISK */}

      <div className="analytics-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Rainfall vs Risk</h2>

              <p>
                Relationship between rainfall conditions and
                estimated landslide risk
              </p>
            </div>

            <CloudRain size={18} />
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rainfallRiskData}>
                <CartesianGrid
                  stroke="#2a2e33"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#70757b"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={75}
                />

                <YAxis
                  stroke="#70757b"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#181b1f",
                    border: "1px solid #343a40",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  stroke="#8295a5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="risk"
                  name="Risk Score"
                  stroke="#b38a58"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SOIL MOISTURE */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Soil Moisture vs Risk</h2>

              <p>
                Current soil saturation compared with risk score
              </p>
            </div>

            <Droplets size={18} />
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={soilRiskData}>
                <CartesianGrid
                  stroke="#2a2e33"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#70757b"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={75}
                />

                <YAxis
                  stroke="#70757b"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#181b1f",
                    border: "1px solid #343a40",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="soil"
                  name="Soil Moisture (%)"
                  stroke="#8295a5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                <Line
                  type="monotone"
                  dataKey="risk"
                  name="Risk Score"
                  stroke="#a99b61"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TOP HIGH RISK LOCATIONS */}

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Highest Risk Locations</h2>

            <p>
              Locations currently showing the greatest estimated
              landslide risk
            </p>
          </div>

          <Mountain size={18} />
        </div>

        <div className="analytics-risk-list">
          {topRiskLocations.map((location, index) => (
            <div
              key={location.id}
              className="analytics-risk-row"
            >
              <div className="rank-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="analytics-location">
                <strong>{location.name}</strong>

                <span>{location.state}</span>
              </div>

              <div className="analytics-factor">
                <span>Rainfall</span>

                <strong>{location.rainfall} mm</strong>
              </div>

              <div className="analytics-factor">
                <span>Soil Moisture</span>

                <strong>{location.soilMoisture}%</strong>
              </div>

              <div className="analytics-factor">
                <span>Slope</span>

                <strong>{location.slope}°</strong>
              </div>

              <div
                className="analytics-risk-score"
                style={{
                  color: getRiskColor(location.risk.level),
                }}
              >
                <strong>{location.risk.score}</strong>

                <span>{location.risk.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI INSIGHTS */}

      <div className="panel ai-insights-panel">
        <div className="panel-header">
          <div>
            <h2>AI Analytical Insights</h2>

            <p>
              Automated interpretation of current environmental
              conditions
            </p>
          </div>

          <Brain size={19} />
        </div>

        <div className="ai-insights-grid">
          <div className="ai-insight">
            <div className="ai-insight-number">01</div>

            <div>
              <strong>Risk concentration</strong>

              <p>
                {highCount + criticalCount} monitored locations are
                currently classified as High or Critical risk,
                indicating areas that should receive increased
                monitoring attention.
              </p>
            </div>
          </div>

          <div className="ai-insight">
            <div className="ai-insight-number">02</div>

            <div>
              <strong>Rainfall influence</strong>

              <p>
                Elevated rainfall contributes significantly to the
                current risk assessment because rainfall is one of
                the primary factors in the prototype risk model.
              </p>
            </div>
          </div>

          <div className="ai-insight">
            <div className="ai-insight-number">03</div>

            <div>
              <strong>Soil saturation</strong>

              <p>
                Areas with higher soil moisture require closer
                observation because increased saturation can
                contribute to slope instability.
              </p>
            </div>
          </div>

          <div className="ai-insight">
            <div className="ai-insight-number">04</div>

            <div>
              <strong>Priority monitoring</strong>

              <p>
                The highest-risk locations should receive priority
                for field inspection, rainfall monitoring and
                early-warning preparedness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
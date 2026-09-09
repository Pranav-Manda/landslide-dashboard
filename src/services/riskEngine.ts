export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskInputs {
  rainfall: number;
  soilMoisture: number;
  slope: number;
  historicalSusceptibility: number;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  contributions: {
    rainfall: number;
    soilMoisture: number;
    slope: number;
    historicalSusceptibility: number;
  };
}

export function calculateRisk(inputs: RiskInputs): RiskResult {
  const rainfall = Math.min(Math.max(inputs.rainfall, 0), 150);
  const soilMoisture = Math.min(Math.max(inputs.soilMoisture, 0), 100);
  const slope = Math.min(Math.max(inputs.slope, 0), 60);
  const historicalSusceptibility = Math.min(
    Math.max(inputs.historicalSusceptibility, 0),
    100
  );

  // Normalize each factor to 0–100
  const rainfallScore = (rainfall / 150) * 100;
  const slopeScore = (slope / 60) * 100;

  // Weighted risk model
  const rainfallContribution = rainfallScore * 0.30;
  const soilContribution = soilMoisture * 0.30;
  const slopeContribution = slopeScore * 0.25;
  const historicalContribution = historicalSusceptibility * 0.15;

  const score =
    rainfallContribution +
    soilContribution +
    slopeContribution +
    historicalContribution;

  const roundedScore = Math.round(score);

  return {
    score: roundedScore,
    level: getRiskLevel(roundedScore),

    contributions: {
      rainfall: Math.round(rainfallContribution),
      soilMoisture: Math.round(soilContribution),
      slope: Math.round(slopeContribution),
      historicalSusceptibility: Math.round(historicalContribution),
    },
  };
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MODERATE";
  return "LOW";
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "#b86d6d";

    case "HIGH":
      return "#b38a58";

    case "MODERATE":
      return "#a99b61";

    case "LOW":
      return "#6f9b78";
  }
}

export function getRiskTrend(
  currentScore: number,
  previousScore: number
): "RISING" | "FALLING" | "STABLE" {
  if (currentScore > previousScore + 3) {
    return "RISING";
  }

  if (currentScore < previousScore - 3) {
    return "FALLING";
  }

  return "STABLE";
}

export function getRiskRecommendations(level: RiskLevel): string[] {
  switch (level) {
    case "CRITICAL":
      return [
        "Immediate field inspection recommended",
        "Prepare evacuation resources",
        "Alert nearby communities",
        "Coordinate emergency response teams",
        "Maintain continuous monitoring",
      ];

    case "HIGH":
      return [
        "Inspect vulnerable slopes",
        "Monitor rainfall closely",
        "Prepare response teams",
        "Issue precautionary warnings",
      ];

    case "MODERATE":
      return [
        "Increase monitoring frequency",
        "Review local slope conditions",
        "Monitor rainfall and soil moisture",
      ];

    case "LOW":
      return [
        "Continue routine monitoring",
        "Maintain normal observation schedule",
      ];
  }
}
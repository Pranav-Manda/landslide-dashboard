import type { RiskLevel } from "./riskEngine";

export interface GeneratedAlert {
  id: number;
  locationId: number;
  locationName: string;
  state: string;
  level: RiskLevel;
  score: number;
  message: string;
  timestamp: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export function generateAlert(
  locationId: number,
  locationName: string,
  state: string,
  level: RiskLevel,
  score: number
): GeneratedAlert | null {

  if (level === "LOW") {
    return null;
  }

  const message =
    level === "CRITICAL"
      ? "Critical landslide conditions detected. Immediate field assessment and emergency preparedness are recommended."
      : level === "HIGH"
      ? "High landslide risk detected. Increased monitoring and precautionary action are recommended."
      : "Moderate landslide risk detected. Continue close monitoring of environmental conditions.";

  return {
    id: Date.now(),
    locationId,
    locationName,
    state,
    level,
    score,
    message,
    timestamp: new Date().toLocaleTimeString(),
    status: "ACTIVE",
  };
}
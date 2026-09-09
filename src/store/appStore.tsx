import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  locations as initialLocations,
  type Location,
} from "../data/locations";

import { calculateRisk } from "../services/riskEngine";

import type { GeneratedAlert } from "../services/alertService";

interface AppContextType {
  locations: Location[];

  alerts: GeneratedAlert[];

  updateLocationRisk: (
    id: number,
    rainfall: number,
    soilMoisture: number,
    slope: number,
    historicalSusceptibility: number
  ) => void;

  addAlert: (alert: GeneratedAlert) => void;

  acknowledgeAlert: (alertId: number) => void;

  resolveAlert: (alertId: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const buildInitialAlerts = (): GeneratedAlert[] =>
  initialLocations
    .filter((location) => location.risk.level !== "LOW")
    .slice(0, 4)
    .map((location, index) => ({
      id: 1000 + location.id + index,
      locationId: location.id,
      locationName: location.name,
      state: location.state,
      level: location.risk.level,
      score: location.risk.score,
      message:
        location.risk.level === "CRITICAL"
          ? "Critical landslide conditions detected. Immediate field assessment and emergency preparedness are recommended."
          : "High landslide risk detected. Increased monitoring and precautionary action is recommended.",
      timestamp: new Date(
        Date.now() - index * 15 * 60 * 1000
      ).toLocaleTimeString(),
      status: location.risk.level === "CRITICAL" ? "ACTIVE" : "ACKNOWLEDGED",
    }));

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locations, setLocations] = useState<Location[]>(() => {
    if (typeof window === "undefined") {
      return initialLocations;
    }

    const savedLocations = window.localStorage.getItem(
      "landwatch-locations"
    );

    return savedLocations
      ? (JSON.parse(savedLocations) as Location[])
      : initialLocations;
  });

  const [alerts, setAlerts] = useState<GeneratedAlert[]>(() => {
    if (typeof window === "undefined") {
      return buildInitialAlerts();
    }

    const savedAlerts = window.localStorage.getItem(
      "landwatch-alerts"
    );

    return savedAlerts
      ? (JSON.parse(savedAlerts) as GeneratedAlert[])
      : buildInitialAlerts();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "landwatch-locations",
        JSON.stringify(locations)
      );
    }
  }, [locations]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "landwatch-alerts",
        JSON.stringify(alerts)
      );
    }
  }, [alerts]);

  // ==========================================
  // UPDATE LOCATION RISK
  // ==========================================

  const updateLocationRisk = (
    id: number,
    rainfall: number,
    soilMoisture: number,
    slope: number,
    historicalSusceptibility: number
  ) => {
    setLocations((currentLocations) =>
      currentLocations.map((location) => {
        if (location.id !== id) {
          return location;
        }

        // Calculate new risk
        const newRisk = calculateRisk({
          rainfall,
          soilMoisture,
          slope,
          historicalSusceptibility,
        });

        // ==========================================
        // AUTOMATIC ALERT FOR HIGH / CRITICAL RISK
        // ==========================================

        if (
          newRisk.level === "HIGH" ||
          newRisk.level === "CRITICAL"
        ) {
          const alert: GeneratedAlert = {
            id: Date.now(),
            locationId: location.id,
            locationName: location.name,
            state: location.state,
            level: newRisk.level,
            score: newRisk.score,

            message:
              newRisk.level === "CRITICAL"
                ? "Critical landslide conditions detected. Immediate field assessment and emergency preparedness are recommended."
                : "High landslide risk detected. Increased monitoring and precautionary action is recommended.",

            timestamp: new Date().toLocaleTimeString(),

            status: "ACTIVE",
          };

          // Add alert only if there isn't already
          // an active alert for this location
          setAlerts((currentAlerts) => {
            const alreadyActive = currentAlerts.some(
              (existingAlert) =>
                existingAlert.locationId === location.id &&
                existingAlert.status === "ACTIVE"
            );

            if (alreadyActive) {
              return currentAlerts;
            }

            return [
              alert,
              ...currentAlerts,
            ];
          });
        }

        // ==========================================
        // UPDATE LOCATION DATA
        // ==========================================

        return {
          ...location,

          rainfall,
          soilMoisture,
          slope,
          historicalSusceptibility,

          previousRisk: location.risk.score,

          risk: newRisk,
        };
      })
    );
  };

  // ==========================================
  // ADD ALERT
  // ==========================================

  const addAlert = (
    alert: GeneratedAlert
  ) => {
    setAlerts((currentAlerts) => {

      // Prevent duplicate ACTIVE alerts
      // for the same location
      const alreadyActive = currentAlerts.some(
        (existingAlert) =>
          existingAlert.locationId === alert.locationId &&
          existingAlert.status === "ACTIVE"
      );

      if (alreadyActive) {
        return currentAlerts;
      }

      return [
        alert,
        ...currentAlerts,
      ];
    });
  };

  // ==========================================
  // ACKNOWLEDGE ALERT
  // ==========================================

  const acknowledgeAlert = (
    alertId: number
  ) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "ACKNOWLEDGED",
            }
          : alert
      )
    );
  };

  // ==========================================
  // RESOLVE ALERT
  // ==========================================

  const resolveAlert = (
    alertId: number
  ) => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "RESOLVED",
            }
          : alert
      )
    );
  };

  // ==========================================
  // APP PROVIDER
  // ==========================================

  return (
    <AppContext.Provider
      value={{
        locations,
        alerts,
        updateLocationRisk,
        addAlert,
        acknowledgeAlert,
        resolveAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// USE APP STORE
// ==========================================

export function useAppStore() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppStore must be used inside AppProvider"
    );
  }

  return context;
}
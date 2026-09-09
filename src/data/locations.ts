import { calculateRisk, type RiskResult } from "../services/riskEngine";

export interface Location {
  id: number;
  name: string;
  state: string;
  latitude: number;
  longitude: number;

  rainfall: number;
  soilMoisture: number;
  slope: number;
  historicalSusceptibility: number;

  previousRisk: number;
  risk: RiskResult;

  roads: number;
  settlements: number;
  infrastructure: number;

  lastUpdated: string;
}

const rawLocations = [
  {
    id: 1,
    name: "East Sikkim",
    state: "Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
    rainfall: 78,
    soilMoisture: 74,
    slope: 32,
    historicalSusceptibility: 82,
    previousRisk: 58,
    roads: 12,
    settlements: 8,
    infrastructure: 5,
  },

  {
    id: 2,
    name: "West Sikkim",
    state: "Sikkim",
    latitude: 27.25,
    longitude: 88.15,
    rainfall: 64,
    soilMoisture: 68,
    slope: 29,
    historicalSusceptibility: 76,
    previousRisk: 52,
    roads: 9,
    settlements: 6,
    infrastructure: 3,
  },

  {
    id: 3,
    name: "Tawang",
    state: "Arunachal Pradesh",
    latitude: 27.586,
    longitude: 91.859,
    rainfall: 91,
    soilMoisture: 81,
    slope: 38,
    historicalSusceptibility: 87,
    previousRisk: 69,
    roads: 15,
    settlements: 5,
    infrastructure: 4,
  },

  {
    id: 4,
    name: "Itanagar",
    state: "Arunachal Pradesh",
    latitude: 27.0844,
    longitude: 93.6053,
    rainfall: 55,
    soilMoisture: 61,
    slope: 21,
    historicalSusceptibility: 65,
    previousRisk: 43,
    roads: 8,
    settlements: 11,
    infrastructure: 6,
  },

  {
    id: 5,
    name: "Shillong",
    state: "Meghalaya",
    latitude: 25.5788,
    longitude: 91.8933,
    rainfall: 72,
    soilMoisture: 76,
    slope: 26,
    historicalSusceptibility: 71,
    previousRisk: 57,
    roads: 10,
    settlements: 14,
    infrastructure: 7,
  },

  {
    id: 6,
    name: "Cherrapunji",
    state: "Meghalaya",
    latitude: 25.2849,
    longitude: 91.7211,
    rainfall: 112,
    soilMoisture: 89,
    slope: 34,
    historicalSusceptibility: 91,
    previousRisk: 75,
    roads: 13,
    settlements: 7,
    infrastructure: 4,
  },

  {
    id: 7,
    name: "Aizawl",
    state: "Mizoram",
    latitude: 23.7271,
    longitude: 92.7176,
    rainfall: 67,
    soilMoisture: 70,
    slope: 42,
    historicalSusceptibility: 84,
    previousRisk: 62,
    roads: 11,
    settlements: 12,
    infrastructure: 6,
  },

  {
    id: 8,
    name: "Kohima",
    state: "Nagaland",
    latitude: 25.6751,
    longitude: 94.1086,
    rainfall: 59,
    soilMoisture: 63,
    slope: 31,
    historicalSusceptibility: 72,
    previousRisk: 48,
    roads: 7,
    settlements: 9,
    infrastructure: 4,
  },

  {
    id: 9,
    name: "Imphal",
    state: "Manipur",
    latitude: 24.817,
    longitude: 93.9368,
    rainfall: 48,
    soilMoisture: 54,
    slope: 18,
    historicalSusceptibility: 58,
    previousRisk: 36,
    roads: 6,
    settlements: 13,
    infrastructure: 8,
  },

  {
    id: 10,
    name: "Agartala",
    state: "Tripura",
    latitude: 23.8315,
    longitude: 91.2868,
    rainfall: 43,
    soilMoisture: 49,
    slope: 12,
    historicalSusceptibility: 42,
    previousRisk: 28,
    roads: 5,
    settlements: 10,
    infrastructure: 5,
  },

  {
    id: 11,
    name: "Guwahati",
    state: "Assam",
    latitude: 26.1445,
    longitude: 91.7362,
    rainfall: 51,
    soilMoisture: 58,
    slope: 16,
    historicalSusceptibility: 53,
    previousRisk: 34,
    roads: 8,
    settlements: 16,
    infrastructure: 9,
  },

  {
    id: 12,
    name: "Gangtok",
    state: "Sikkim",
    latitude: 27.3314,
    longitude: 88.6138,
    rainfall: 83,
    soilMoisture: 79,
    slope: 35,
    historicalSusceptibility: 86,
    previousRisk: 65,
    roads: 14,
    settlements: 10,
    infrastructure: 7,
  },
];

export const locations: Location[] = rawLocations.map((location) => ({
  ...location,
  risk: calculateRisk({
    rainfall: location.rainfall,
    soilMoisture: location.soilMoisture,
    slope: location.slope,
    historicalSusceptibility: location.historicalSusceptibility,
  }),
  lastUpdated: "Just now",
}));

export function getLocationById(id: number) {
  return locations.find((location) => location.id === id);
}

export function getCriticalLocations() {
  return locations.filter((location) => location.risk.level === "CRITICAL");
}

export function getHighRiskLocations() {
  return locations.filter((location) => location.risk.level === "HIGH");
}

export function getModerateRiskLocations() {
  return locations.filter((location) => location.risk.level === "MODERATE");
}

export function getLowRiskLocations() {
  return locations.filter((location) => location.risk.level === "LOW");
}
export type ProhibitionStatus = "none" | "prohibited" | "severe" | "unknown";

export type LocationDetails = {
  name: string;
  municipality?: string;
  county?: string;
  latitude: number;
  longitude: number;
};

export type ForecastDay = {
  date: string;
  level: number | null;
  name: string;
  description?: string;
};

export type FireStatus = {
  location: LocationDetails;
  risk: { level: number | null; name: string; description?: string; validFrom?: string; validTo?: string };
  prohibition: {
    status: ProhibitionStatus;
    title: string;
    description?: string;
    authority?: string;
    sourceUrl?: string;
    revisedAt?: string;
  };
  forecast: ForecastDay[];
  checkedAt: string;
};

export type GeocodeResult = LocationDetails & { displayName: string; slug: string };

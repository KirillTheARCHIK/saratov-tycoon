import { LatLngBounds } from "leaflet";
import { COMMERCIAL_FACILITY_COLOR, INDUSTRY_FACILITY_COLOR, RESIDENTAL_FACILITY_COLOR } from "../utils/style";

export enum FacilityType {
  Residental = "residental",
  Commercial = "commercial",
  Industry = "industry",
}
export interface Facility {
  id?: String;
  name: String;
  cost: number;
  userId?: String;
  mapInfo: any;
  type?: FacilityType;
}

export function getFacilityBounds(facility: Facility) {
  return new LatLngBounds(
    [facility.mapInfo.boundingbox[0], facility.mapInfo.boundingbox[2]],
    [facility.mapInfo.boundingbox[1], facility.mapInfo.boundingbox[3]]
  );
}

export function getFacilityColor  (facility: Facility)  {
  switch (facility.type) {
    case FacilityType.Residental:
      return RESIDENTAL_FACILITY_COLOR;
    case FacilityType.Commercial:
      return COMMERCIAL_FACILITY_COLOR;
    case FacilityType.Industry:
      return INDUSTRY_FACILITY_COLOR;
  }
}

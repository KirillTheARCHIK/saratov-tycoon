import { LatLngBounds } from "leaflet";

export interface Facility {
  id?: String;
  name: String;
  cost: number;
  userId?: String;
  mapInfo: any;
}

export function getFacilityBounds(facility: Facility) {
  return new LatLngBounds([
    facility.mapInfo.boundingbox[0],
    facility.mapInfo.boundingbox[2],
  ], [
    facility.mapInfo.boundingbox[1],
    facility.mapInfo.boundingbox[3],
  ]);
}

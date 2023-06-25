import { createContext } from "react";
import { Facility } from "../classes/Facility";

export interface IFacilityContext {
  facilities: {
    list: Facility[];
    selectedFacility?: Facility;
  };
  setFacilities?: React.Dispatch<any>;
  setSelectedFacility?: React.Dispatch<any>;
}

export const IFacilityContextDefaultValues = {
  facilities: {
    list: [],
  },
} as IFacilityContext;

export const FacilityContext = createContext<IFacilityContext>(
  IFacilityContextDefaultValues
);

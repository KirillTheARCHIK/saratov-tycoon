import React, { useState, useEffect } from "react";
import { Rectangle } from "react-leaflet";
import { Facility, getFacilityBounds } from "../../classes/Facility";

const SELECTED_FACILITY_COLOR = "#ff0000";
const RESIDENTAL_FACILITY_COLOR = "green";
const COMMERCIAL_FACILITY_COLOR = "blue";
const INDUSTRY_FACILITY_COLOR = "orange";

export const FacilityBounds = (props: {
  facility: Facility;
  isSelected?: boolean;
}) => {
  return (
    <Rectangle
      bounds={getFacilityBounds(props.facility)}
      color={props.isSelected ? SELECTED_FACILITY_COLOR : undefined}
      fillColor={props.isSelected ? SELECTED_FACILITY_COLOR : undefined}
    />
  );
};

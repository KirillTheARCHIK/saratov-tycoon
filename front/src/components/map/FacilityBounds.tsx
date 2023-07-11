import React, { useState, useEffect } from "react";
import { Rectangle } from "react-leaflet";
import {
  Facility,
  getFacilityBounds,
  getFacilityColor,
} from "../../classes/Facility";
import { SELECTED_FACILITY_COLOR } from "../../utils/style";

export const FacilityBounds = (props: {
  facility: Facility;
  isSelected?: boolean;
  isYours?: boolean;
}) => {
  let color = props.isYours ? getFacilityColor(props.facility) :  getFacilityColor(props.facility)+'50';
  return (
    <Rectangle
      bounds={getFacilityBounds(props.facility)}
      color={props.isSelected ? SELECTED_FACILITY_COLOR : color}
      fillColor={props.isSelected ? SELECTED_FACILITY_COLOR : color}
      fillOpacity={0.4}
    />
  );
};

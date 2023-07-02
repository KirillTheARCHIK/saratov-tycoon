import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Popup, PopupProps } from "react-leaflet";
import { Facility } from "../../classes/Facility";

export const FacilityPopup = (
  props: {
    title?: String;
    facility: Facility;
  } & PopupProps
) => {
  return (
    <Popup position={props.position}>
      <div className="f-c">
        <h3>{props.facility.mapInfo.address.road?.replace('улица', 'ул.')} {props.facility.mapInfo.address.house_number}</h3>
        <p><b>Стоимость: </b>{props.facility.cost}</p>
      </div>
    </Popup>
  );
};

import { LatLngBounds } from "leaflet";
import React, { useState, useEffect, useContext } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { Facility, getFacilityBounds } from "../classes/Facility";
import { FacilityBounds } from "../components/map/FacilityBounds";
import {
  FacilityContext,
  IFacilityContextDefaultValues,
} from "../context/FacilityContext";
import { http } from "../utils/http";

const MapEventHandler = () => {
  const { setSelectedFacility} = useContext(FacilityContext);

  const map = useMapEvents({
    click(e) {
      console.log(e.latlng);

      http.post("/facilityInfo", { coords: e.latlng }).then((response) => {
        const res = response.data;
        const facility = res as Facility;
        setSelectedFacility!(facility);
        // console.log(facility);
      });
    },
  });
  return <></>;
};

export const MapPage = (props: {}) => {
  const [facilities, setFacilities] = useState(
    IFacilityContextDefaultValues.facilities.list
  );
  const [selectedFacility, setSelectedFacility] = useState<Facility>();

  console.log(selectedFacility);
  

  return (
    <FacilityContext.Provider
      value={{
        facilities: {
          list: facilities,
          selectedFacility,
        },
        setFacilities,
        setSelectedFacility,
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <MapContainer
          scrollWheelZoom={true}
          center={[51.533072, 46.020397]}
          zoom={13}
          minZoom={14}
          maxZoom={18}
          maxBounds={
            new LatLngBounds([51.3921102, 45.8053143], [51.6856159, 46.2097151])
          }
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <MapEventHandler />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selectedFacility ? <FacilityBounds facility={selectedFacility} isSelected={true} /> : null}
        </MapContainer>
      </div>
    </FacilityContext.Provider>
  );
};

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Popup, PopupProps } from "react-leaflet";
import { Facility, FacilityType } from "../../classes/Facility";
import { AuthContext } from "../../context/AuthContext";
import { FacilityContext } from "../../context/FacilityContext";
import { http } from "../../utils/http";
import { RESIDENTAL_FACILITY_COLOR } from "../../utils/style";

export const FacilityPopup = (
  props: {
    title?: String;
    facility: Facility;
  } & PopupProps
) => {
  const { user } = React.useContext(AuthContext);
  const [errorText, setErrorText] = useState<String>();
  const { setSelectedFacility } = React.useContext(FacilityContext);

  useEffect(() => {
    setErrorText(undefined);
  }, [props.facility]);

  return (
    <Popup position={props.position} closeButton={false}>
      <div
        style={{
          height: 0,
          width: 0,
          left: "103%",
          top: "-5px",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => {
          setTimeout(() => {
            setSelectedFacility!(undefined);
          }, 200);
        }}
      >
        <IoMdClose size={"15px"} />
      </div>
      <div className="f-c" style={{ alignItems: "start" }}>
        <h3>{props.facility.name}</h3>
        <p>
          <b>Стоимость: </b>
          {props.facility.cost}
        </p>
        {!props.facility.userId ? (
          <div className="f-r">
            <button
              onClick={async () => {
                const facilityToBuy = props.facility;
                facilityToBuy.type = FacilityType.Residental;
                facilityToBuy.userId = user!._id;

                try {
                  await http.post("/facility", facilityToBuy);
                } catch (e) {
                  setErrorText((e as any).response.data.message);
                }
              }}
              className={"icon-button"}
              style={{
                backgroundColor: RESIDENTAL_FACILITY_COLOR,
              }}
              title={"Купить"}
            >
              <MdOutlineAttachMoney size={"20px"} />
            </button>
          </div>
        ) : null}
        {errorText ? <p style={{ color: "red" }}>{errorText}</p> : null}
      </div>
    </Popup>
  );
};

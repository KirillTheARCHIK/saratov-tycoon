import React, { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";

export const Money = (props: { money: number; inversed?: Boolean }) => {
  return (
    <div className="f-r" style={{ alignItems: "center" }}>
      <p
        style={{
          fontSize: "25px",
          margin: "3px 5px",
          fontWeight: "bold",
          color: props.inversed
            ? "var(--color-onPrimary)"
            : "var(--color-font)",
          cursor: 'default',
        }}
      >
        {Math.floor(props.money ?? 0)}
      </p>
      <FaMoneyBillWave size={"25px"} color={"#1AD643"} />
    </div>
  );
};

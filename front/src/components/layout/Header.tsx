import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Logo } from "./Logo";
import { Money } from "./Money";

export const Header = (props: {}) => {
  const { user } = useContext(AuthContext);

  return (
    <header
      className="f-r"
      style={{
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <Logo />
      {user ? <Money money={user.money} /> : null}
    </header>
  );
};

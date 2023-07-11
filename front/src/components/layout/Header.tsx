import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Logo } from "./Logo";
import { Money } from "./Money";

export const Header = (props: {}) => {
  const { user, setUser } = useContext(AuthContext);

  return (
    <header
      className="f-r"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <Logo />
      <div className="f-r">
        {user ? <Money money={user.money} inversed /> : null}
        <button onClick={() => {
          localStorage.removeItem('userId');
          setUser!(undefined);
        }} className="onPrimary" style={{marginLeft: '20px'}}>
          Выйти
        </button>
      </div>
    </header>
  );
};

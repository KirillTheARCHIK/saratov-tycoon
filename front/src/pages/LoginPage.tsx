import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../classes/User";
import { AuthContext } from "../context/AuthContext";
import { http } from "../utils/http";

export const LoginPage = (props: {}) => {
  const { user, setUser } = useContext(AuthContext);
  const [isLogin, setMode] = useState(true);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const saveCookie = async (userId: String) => {
    localStorage.setItem('userId', userId.toString());
  }

  const loginF = async () => {
    http
      .post("/login", { login, password })
      .then((res) => {
        saveCookie(res.data._id);
        setUser!(res.data as User);
        navigate('/');
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  };

  const registerF = async () => {
    http
      .post("/register", { login, password })
      .then((res) => {
        saveCookie(res.data._id);
        setUser!(res.data as User);
        navigate('/');
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  };

  useEffect(() => {}, []);

  return (
    <div className="f-c" style={{ alignItems: "center", height: "100vh" }}>
      <div
        className="f-c"
        style={{
          position: "relative",
          width: "300px",
          top: "calc(50% - 200px)",
        }}
      >
        <h3 style={{ textAlign: "center" }}>
          {isLogin ? "Авторизация" : "Регистрация"}
        </h3>
        <p>Логин</p>
        <input
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
        />
        <p>Пароль</p>
        <input
          value={password}
          type={"password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="f-c" style={{ alignItems: "center" }}>
          <button onClick={isLogin ? loginF : registerF}>
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
          <a
            href="#"
            onClick={() => {
              setMode(!isLogin);
            }}
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </a>
        </div>
      </div>
    </div>
  );
};

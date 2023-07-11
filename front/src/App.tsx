import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { User } from "./classes/User";
import { Header } from "./components/layout/Header";
import { AuthContext, IAuthContextDefaultValues } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";
import { http } from "./utils/http";

function App() {
  const [user, setUser] = useState<User>();
  const [userRefreshInterval, setUserRefreshInterval] =
    useState<NodeJS.Timer>();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Header />
          <Outlet />
        </div>
      ),
      children: [
        {
          path: "/",
          element: <MapPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  useEffect(() => {
    clearInterval(userRefreshInterval);
    if (!user) {
      http
        .post("/login", { _id: localStorage.getItem("userId") })
        .then((res) => {
          setUser!(res.data as User);
        })
        .catch((err) => {
          router.navigate("/login");
        });
    } else {
      setUserRefreshInterval(
        setInterval(() => {
          http.get(`/user/${user._id}`).then((res) => {
            setUser(res.data);
          });
        }, 10000)
      );
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;

import * as React from "react";
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext, IAuthContextDefaultValues } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";
import { http } from "./utils/http";

function App() {
  const [user, setUser] = useState();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MapPage />,
      children: [
        // {
        //   path: "team",
        //   element: <Team />,
        //   loader: teamLoader,
        // },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  useEffect(() => {
    if (!user) {
      http
        .post("/login", { id: localStorage.getItem("userId") })
        .then((res) => {
          setUser!(res.data);
        })
        .catch((err) => {
          console.error(err?.response?.data?.message);
          router.navigate("/login");
        });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;

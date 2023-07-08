import * as React from "react";
import { useState, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { User } from "./classes/User";
import { Header } from "./components/layout/Header";
import { AuthContext, IAuthContextDefaultValues } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";
import { http } from "./utils/http";

function App() {
  const [user, setUser] = useState<User>();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>
        <Header />
        <Outlet />
      </div>,
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
    if (!user) {
      http
        .post("/login", { id: localStorage.getItem("userId") })
        .then((res) => {
          setUser!(res.data as User);
        })
        .catch((err) => {
          router.navigate("/login");
        });
    }
  }, [user]);

  console.log(user);
  

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";

function App() {
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

  return <RouterProvider router={router} />;
}

export default App;

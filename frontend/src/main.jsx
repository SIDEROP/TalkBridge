import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthContext from "./Store/Context/ContextProvider/AtuhContext";
import { Provider } from "react-redux";
import store from "./Store/app/Store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layout
import AuthLayout from "./Layouts/AuthLayout";

// pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SingUp from "./Pages/SingUp";

let router = createBrowserRouter([
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/singup",
    element: <SingUp />,
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthContext>
      <RouterProvider router={router} />
    </AuthContext>
  </Provider>
);

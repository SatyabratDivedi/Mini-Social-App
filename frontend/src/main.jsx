import "./App.css";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Profile from "./Profile.jsx";
import Posts from "./Posts.jsx";
import SingUp from "./SingUp.jsx";
import SingIn from "./SignIn.jsx";
import {Toaster} from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SingUp />,
  },
  {
    path: "/signin",
    element: <SingIn />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/posts",
    element: <Posts />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <RouterProvider router={router} />
  </React.StrictMode>
);

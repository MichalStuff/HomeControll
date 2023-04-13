import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import App from "./App";
import { GlobalStyle } from "./GlobalStyles";
import "./index.css";
import { Home } from "./View/Home";
import { Room } from "./View/Room";
import { AppProvider } from "./context/AppContext";
import { SocketProvider } from "./context/SocketContext";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/room/:id",
    element: (
      <SocketProvider>
        <Room />
      </SocketProvider>
    ),
  },
]);

root.render(
  <React.StrictMode>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <GlobalStyle />
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);

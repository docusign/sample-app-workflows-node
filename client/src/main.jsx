import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Hero from "./pages/Hero/Hero.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Hero />,
    },
    {
        path: '/home',
        element: <Home />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

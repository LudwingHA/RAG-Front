import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Home } from "../pages/home/Home";
import { Register } from "../auth/pages/Register";

export const router = createBrowserRouter([
  {path: '/', element: <Home></Home>},
  {path: '/register', element: <Register></Register>}
])
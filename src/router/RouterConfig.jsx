import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Home } from "../pages/home/Home";
import { Register } from "../auth/pages/Register";
import { Login } from "../auth/pages/Login";
import { DectecPothole } from "../pages/baches/DectecPothole";
import { HelpPage } from "../pages/help/HelpPage";

export const router = createBrowserRouter([
  {path: '/', element: <Home></Home>},
  {path: '/register', element: <Register></Register>},
  {path: '/login', element: <Login></Login>},
  {
    path: '/baches', element: <DectecPothole></DectecPothole>
  },
  {
    path: "/ayuda", element: <HelpPage></HelpPage>
  }
])
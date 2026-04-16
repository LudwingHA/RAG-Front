import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home/Home";
import { Register } from "../auth/pages/Register";
import { Login } from "../auth/pages/Login";
import { HelpPage } from "../pages/help/HelpPage";
import { ChatPage } from "../pages/chat/ChatPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { BachesPage } from "../pages/baches/DectecPothole";

export const router = createBrowserRouter([
  { path: '/', element: <Home></Home> },
  { path: '/register', element: <Register></Register> },
  { path: '/login', element: <Login></Login> },
  {
    path: '/baches', element: <ProtectedRoute>
      <BachesPage></BachesPage>
    </ProtectedRoute>
  },
  {
    path: '/profile', element: <ProtectedRoute>
        <ProfilePage></ProfilePage>
    </ProtectedRoute>
  },
  {
    path: '/chat', element: <ProtectedRoute>
      <ChatPage></ChatPage>
    </ProtectedRoute>
  },
  {
    path: "/ayuda", element: <HelpPage></HelpPage>
  }
])
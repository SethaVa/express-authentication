import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PageNotFoundPage from "./pages/PageNotFound";
import PasswordPage from "./pages/Password";
import ProfilePage from "./pages/Profile";
import RecoveryPage from "./pages/Recovery";
import RegisterPage from "./pages/Register";
import ResetPage from "./pages/Reset";
import UsernamePage from "./pages/Username";

// Pages

const router = createBrowserRouter([
  {
    path: "/",
    element: <UsernamePage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/password",
    element: <PasswordPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/recovery",
    element: <RecoveryPage />
  },
  {
    path: "/reset",
    element: <ResetPage />
  },
  {
    path: "*",
    element: <PageNotFoundPage />
  }
])

function App() {
  return (
    <main>
      <RouterProvider router={router}/>
    </main>
  );
}

export default App;

import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
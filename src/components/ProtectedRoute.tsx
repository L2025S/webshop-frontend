import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../services/authService.ts";

// Protects routes that require authentication
const ProtectedRoute = () => {
  // Redirect unauthenticated users to the login page
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render the protected page
  return <Outlet />;
};

export default ProtectedRoute;

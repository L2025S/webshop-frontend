import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../services/AuthService.ts";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router";
import { isAuthenticated } from "../services/authService.ts";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
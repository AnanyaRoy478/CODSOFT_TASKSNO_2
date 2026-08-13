import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  // Replace this with your actual authentication check
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/authentication/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

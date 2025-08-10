import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useContext(AuthContext);
  return token ? <Outlet /> : <Navigate to="/login" />;
}

import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useUserContext } from "./UserContext";

export default function ProtectedRoutes() {
  const { isFetchingAuthStatus, isLoggedIn } = useUserContext();
  if (isFetchingAuthStatus) return <LoadingSpinner />;
  return isLoggedIn ? <Outlet /> : <Navigate to="/signin" />;
}

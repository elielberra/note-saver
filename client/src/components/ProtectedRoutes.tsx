import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { validateIfUserIsAuthenticated } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoutes() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkIsAuthenticated() {
      const isAuthenticated = await validateIfUserIsAuthenticated();
      setIsUserAuthenticated(isAuthenticated);
    }
    checkIsAuthenticated();
  }, []);

  if (isUserAuthenticated === null) return <LoadingSpinner />;
  return isUserAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
}

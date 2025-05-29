import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";
import { UserT } from "../types/types";
import { validateAndGetUserIfAuthenticated } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useConfig } from "./ConfigContext";

type UserContextT = {
  isFetchingAuthStatus: boolean;
  username: UserT["username"] | null;
  isLoggedIn: boolean;
  login: (username: UserContextT["username"]) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextT | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const config = useConfig();
  const [isFetchingAuthStatus, setIsFetchingAuthStatus] = useState(true);
  const [username, setUsername] = useState<UserContextT["username"]>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<UserContextT["isLoggedIn"]>(false);
  const navigate = useNavigate();
  const login = useCallback(
    (username: UserContextT["username"]) => {
      setIsLoggedIn(true);
      setUsername(username);
      navigate("/");
    },
    [navigate]
  );
  const logout = useCallback(async () => {
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUsername(null);
    navigate("/signin");
  }, [navigate]);
  useEffect(() => {
    async function checkAuthStatus() {
      const { isAuthenticated, username } = await validateAndGetUserIfAuthenticated(config.SERVER_URL);
      if (isAuthenticated) {
        login(username);
      }
    }
    checkAuthStatus();
    setIsFetchingAuthStatus(false);
  }, [login]);
  return (
    <UserContext.Provider value={{ isFetchingAuthStatus, isLoggedIn, username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

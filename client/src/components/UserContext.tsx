import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";
import { UserT } from "../types/types";
import {
  handleErrorInResponse,
  handleErrorLogging,
  validateAndGetUserIfAuthenticated
} from "../lib/utils";
import { useNavigate } from "react-router-dom";

type UserContextT = {
  isFetchingAuthStatus: boolean;
  username: UserT["username"] | null;
  isLoggedIn: boolean;
  login: (username: UserContextT["username"]) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextT | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
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
    try {
      const response = await fetch("https://server.notesaver:3333/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        handleErrorInResponse(response);
        return;
      }
      setIsLoggedIn(false);
      setUsername(null);
      navigate("/signin");
    } catch (error) {
      handleErrorLogging(error, "Error while logging out");
    }
  }, [navigate]);
  useEffect(() => {
    async function checkAuthStatus() {
      const { isAuthenticated, username } = await validateAndGetUserIfAuthenticated();
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

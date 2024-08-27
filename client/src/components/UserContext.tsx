import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { UserT } from "../types/types";
import { validateAndGetUserIfAuthenticated } from "../lib/utils";
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
  function login(username: UserContextT["username"]) {
    setIsLoggedIn(true);
    setUsername(username);
    navigate("/");
  }
  function logout() {
    setIsLoggedIn(false);
    setUsername(null);
    navigate("/signin");
  }
  useEffect(() => {
    async function checkAuthStatus() {
      const { isAuthenticated, username } = await validateAndGetUserIfAuthenticated();
      if (isAuthenticated) {
        login(username);
      }
    }
    checkAuthStatus();
    setIsFetchingAuthStatus(false);
  }, []);
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

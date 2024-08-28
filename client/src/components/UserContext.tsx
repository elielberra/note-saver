import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { UserT } from "../types/types";
import { handleErrorLogging, validateAndGetUserIfAuthenticated } from "../lib/utils";
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
  async function logout() {
    try {
      const response = await fetch("http://localhost:3333/signout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUsername(null);
        navigate("/signin");
      } else {
        throw new Error(`Status code: ${response.status} - Server error: ${response.statusText}`);
      }
    } catch (error) {
      handleErrorLogging(error, "Error while logging out");
    }
  }
  useEffect(() => {
    async function checkAuthStatus() {
      const { isAuthenticated, username } = await validateAndGetUserIfAuthenticated();
      if (isAuthenticated) {
        // TODO: Handle login dependency array
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

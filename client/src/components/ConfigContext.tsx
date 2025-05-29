import { createContext, useContext } from "react";
import { ConfigFile } from "../types/types";

const ConfigContext = createContext<ConfigFile | null>(null);

export const ConfigProvider = ConfigContext.Provider;

export function useConfig(): ConfigFile {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

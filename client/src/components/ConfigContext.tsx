import { createContext, useContext } from "react";
import { ConfigFile, ServerUrl, validServerUrls } from "../types/types";

const ConfigContext = createContext<ConfigFile | null>(null);

export const ConfigProvider = ConfigContext.Provider;

function isValidServerUrl(env: string | undefined): env is ServerUrl {
  return validServerUrls.includes(env as ServerUrl);
}

export function useConfig(): ConfigFile {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  const serverUrl = context?.SERVER_URL;
  if (!isValidServerUrl(serverUrl)) {
    throw new Error(
      `Invalid SERVER_URL found on config.js: "${serverUrl}". Expected one of ${validServerUrls.join(", ")}.`
    );
  }
  return context;
}

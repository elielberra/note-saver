import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MainPage from "./MainPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import PageNotFound from "./PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import { UserProvider } from "./UserContext";
import { ConfigProvider } from "./ConfigContext";
import { ConfigFile, validServerUrls } from "../types/types";
import LoadingSpinner from "./LoadingSpinner";
import FallbackText from "./FallbackText";
import { isValidServerUrl } from "../lib/utils";

export default function App() {
  const [config, setConfig] = useState<ConfigFile | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/config.json");
        if (!response.ok) throw new Error("Failed to load config.json");
        const configData: ConfigFile = await response.json();
        if (!isValidServerUrl(configData.SERVER_URL)) {
          throw new Error(
            `Invalid SERVER_URL found on config.js: "${configData.SERVER_URL}". Expected one of ${validServerUrls.join(", ")}.`
          );
        }
        setConfig(configData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setIsLoadingConfig(false);
      }
    }
    fetchConfig();
  }, []);

  if (isLoadingConfig) return <LoadingSpinner />;
  if (error) return <FallbackText text={`Error loading configuration file: ${error}`} />;
  if (!config) return <FallbackText text="Configuration file not available" />;
  return (
    <ConfigProvider value={config}>
      <Router>
        <UserProvider>
          <Layout>
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<MainPage />} />
              </Route>
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        </UserProvider>
      </Router>
    </ConfigProvider>
  );
}

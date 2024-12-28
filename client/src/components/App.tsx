import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MainPage from "./MainPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import PageNotFound from "./PageNotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import { UserProvider } from "./UserContext";

export default function App() {
  return (
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
  );
}
console.log("TEST2");

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import RegisterPage from "./RegisterPage";
import Layout from "./Layout";

export default function App() {
  console.log("HIIII my friend");
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

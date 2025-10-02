import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/welcome/WelcomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
// import других страниц, когда появятся
// import ProfilePage from "./pages/Profile/ProfilePage";
// import StreamSetupPage from "./pages/StreamSetup/StreamSetupPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Позже добавим новые страницы */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* <Route path="/setup" element={<StreamSetupPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
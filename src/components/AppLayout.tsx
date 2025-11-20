// src/components/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout: React.FC = () => {
  return (
    <>
      <Navbar />        {/* Теперь Navbar живёт всегда! */}
      <Outlet />        {/* Здесь рендерятся все страницы */}
    </>
  );
};

export default AppLayout;
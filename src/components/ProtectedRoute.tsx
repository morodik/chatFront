// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type Permission } from "../context/AuthContext";

interface ProtectedRouteProps {
  permission?: Permission;
  /** Кредирект при отсутсвии авторизации */
  redirectTo?: string;
  /** при недостатке прав */
  forbiddenTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  redirectTo = "/login",
  forbiddenTo = "/forbidden",
}) => {
  const { isAuth, hasPermission, loading } = useAuth();

  
  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "var(--text-primary)",
        fontSize: 20,
        background: "var(--bg-page)",
      }}>
        Загрузка...
      </div>
    );
  }

  // не авторизован
  if (!isAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  // авторизован но нет конкретного права
  if (permission && !hasPermission(permission)) {
    return <Navigate to={forbiddenTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
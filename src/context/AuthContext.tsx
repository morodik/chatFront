// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export type Role = "guest" | "user" | "moderator" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  role: Role;
  isAuth: boolean;
  loading: boolean;
  hasPermission: (permission: Permission) => boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// матрица прав 
export type Permission =
  | "view:welcome"
  | "view:profile"
  | "view:dashboard"
  | "view:platformSelect"
  | "view:admin"
  | "tracking:start"
  | "tracking:stop"
  | "favorites:read"
  | "favorites:write"
  | "history:read"
  | "history:delete"
  | "users:read"
  | "users:setRole"
  | "users:delete"
  | "messages:read"
  | "messages:moderate";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: [
    "view:welcome",
  ],
  user: [
    "view:welcome",
    "view:profile",
    "view:dashboard",
    "view:platformSelect",
    "tracking:start",
    "tracking:stop",
    "favorites:read",
    "favorites:write",
    "history:read",
    "history:delete",
    "messages:read",
  ],
  moderator: [
    "view:welcome",
    "view:profile",
    "view:dashboard",
    "view:platformSelect",
    "tracking:start",
    "tracking:stop",
    "favorites:read",
    "favorites:write",
    "history:read",
    "history:delete",
    "messages:read",
    "messages:moderate",
    "users:read",
  ],
  admin: [
    "view:welcome",
    "view:profile",
    "view:dashboard",
    "view:platformSelect",
    "view:admin",
    "tracking:start",
    "tracking:stop",
    "favorites:read",
    "favorites:write",
    "history:read",
    "history:delete",
    "messages:read",
    "messages:moderate",
    "users:read",
    "users:setRole",
    "users:delete",
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:8080/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // бэк должен вернуть { id, email, role }
      setUser({
        id: res.data.id,
        email: res.data.email,
        role: res.data.role ?? "user",
      });
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("trackingData");
    window.dispatchEvent(new Event("localStorageChanged"));
    setUser(null);
  };

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      const currentRole: Role = user?.role ?? "guest";
      return ROLE_PERMISSIONS[currentRole].includes(permission);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? "guest",
        isAuth: !!user,
        loading,
        hasPermission,
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/** проверка наличия прав */
export const usePermission = (permission: Permission): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};
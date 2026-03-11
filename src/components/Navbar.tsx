// src/components/Navbar.tsx — с поддержкой ролей
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const ROLE_COLORS: Record<string, string> = {
  admin: "#ef4444",
  moderator: "#8b5cf6",
  user: "#3b82f6",
  guest: "#6b7280",
};

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuth, user, hasPermission, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const linksRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({
    opacity: 1,
    width: 100,
    transform: "translateX(0px)",
  });

  const updateBubble = () => {
    if (!linksRef.current) return;
    const activeLink = linksRef.current.querySelector(
      `a[href="${location.pathname}"]`
    ) as HTMLElement;
    const target = activeLink ?? linksRef.current.querySelector("a");
    if (!target) return;
    const linkRect = target.getBoundingClientRect();
    const containerRect = linksRef.current.getBoundingClientRect();
    setBubbleStyle({
      transform: `translateX(${linkRect.left - containerRect.left - 8}px)`,
      width: linkRect.width + 16,
      opacity: 1,
    });
  };

  useEffect(() => {
    updateBubble();
  }, [location.pathname, isAuth, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="Navbar">
      {/* Навигационные ссылки */}
      <div className={`Navbar__links ${open ? "open" : ""}`} ref={linksRef}>
        <div className="Navbar__bubble" style={bubbleStyle} />

        {/* Главная — всегда */}
        <Link to="/">Главная</Link>

        {/* Платформа — только с правом view:platformSelect */}
        {isAuth && hasPermission("view:platformSelect") && (
          <Link to="/platform-select">Платформа</Link>
        )}

        {/* Профиль — только авторизованным */}
        {isAuth && hasPermission("view:profile") && (
          <Link to="/profile">Профиль</Link>
        )}

        {/* Панель администратора — только admin */}
        {isAuth && hasPermission("view:admin") && (
          <Link to="/admin">Админ</Link>
        )}

        {/* Войти — для гостей */}
        {!isAuth && <Link to="/login">Войти</Link>}
      </div>

      {/* Бейдж роли текущего пользователя */}
      {isAuth && user && (
        <div
          className="Navbar__roleBadge"
          style={{
            background: ROLE_COLORS[user.role] ?? "#6b7280",
          }}
          title={`Ваша роль: ${user.role}`}
        >
          {user.role}
        </div>
      )}

      {/* Кнопка выхода — если авторизован */}
      {isAuth && (
        <button className="Navbar__logout" onClick={handleLogout}>
          Выйти
        </button>
      )}

      <div className="Navbar__burger" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </div>

      {/* Смена темы */}
      <button className="ThemeToggle" onClick={toggleTheme}>
        {theme === "dark" ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-title)" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className="icon sun">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-title)" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className="icon moon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
          </svg>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
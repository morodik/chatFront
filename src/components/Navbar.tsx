// Navbar.tsx — с глобальной темой
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ← импортируй это
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // ← глобальная тема!
  const location = useLocation();
  const linksRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  // Пузырёк
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
  }, [location.pathname, isAuth]);

  useEffect(() => {
    const checkAuth = () => setIsAuth(!!localStorage.getItem("token"));
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <nav className="Navbar">
      {/* Ссылки */}
      <div className={`Navbar__links ${open ? "open" : ""}`} ref={linksRef}>
        <div className="Navbar__bubble" style={bubbleStyle} />

        <Link to="/">Главная</Link>
        {isAuth && <Link to="/platform-select">Платформа</Link>}
        {isAuth && <Link to="/profile">Профиль</Link>}
        {!isAuth && <Link to="/login">Войти</Link>}
      </div>

      <div className="Navbar__burger" onClick={() => setOpen(!open)}>
        <span />
        <span />
        <span />
      </div>

      {/* Кнопка смены темы — теперь глобальная */}
      <button className="ThemeToggle" onClick={toggleTheme}>
        {theme === "dark" ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-title)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon sun">
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-title)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon moon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
          </svg>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      background: "var(--bg-page)",
      fontFamily: "'SF Pro Display', 'Roboto', sans-serif",
      padding: 20,
    }}>
      <div style={{
        fontSize: 80,
        fontWeight: 700,
        color: "rgba(239, 68, 68, 0.8)",
        lineHeight: 1,
      }}>
        403
      </div>

      <h1 style={{
        margin: 0,
        fontSize: 28,
        fontWeight: 600,
        color: "var(--text-primary)",
        textAlign: "center",
      }}>
        Доступ запрещён
      </h1>

      <p style={{
        margin: 0,
        fontSize: 17,
        color: "var(--text-secondary)",
        textAlign: "center",
        maxWidth: 400,
        lineHeight: 1.6,
      }}>
        Ваша роль <strong style={{ color: "var(--text-primary)" }}>{role}</strong> не имеет прав для просмотра этой страницы.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 24px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            color: "var(--text-primary)",
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          ← Назад
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            background: "var(--bg-button)",
            border: "1px solid var(--border-hover)",
            borderRadius: 14,
            color: "var(--text-button)",
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          На главную
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
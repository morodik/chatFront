import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Role } from "../../context/AuthContext";
import "./AdminPage.css";

interface UserRecord {
  id: number;
  email: string;
  role: Role;
  createdAt?: string;
}

const ALL_ROLES: Role[] = ["user", "moderator", "admin"];

const ROLE_BADGE_COLORS: Record<Role, string> = {
  guest: "#6b7280",
  user: "#3b82f6",
  moderator: "#8b5cf6",
  admin: "#ef4444",
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Доступ запрещён (403). Недостаточно прав.");
      } else {
        setError(err.response?.data?.error || "Ошибка загрузки пользователей");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSetRole = async (userId: number, newRole: Role) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showSuccess(`Роль пользователя #${userId} изменена на ${newRole}`);
    } catch (err: any) {
      alert(err.response?.data?.error || "Не удалось изменить роль");
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    if (!window.confirm(`Удалить пользователя ${email}?\nЭто действие нельзя отменить.`)) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showSuccess(`Пользователь ${email} удалён`);
    } catch (err: any) {
      alert(err.response?.data?.error || "Не удалось удалить пользователя");
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="AdminPage">
      <div className="AdminPage__header">
        <div>
          <h1 className="AdminPage__title">Панель администратора</h1>
          <p className="AdminPage__subtitle">Управление пользователями и ролями</p>
        </div>
        <button className="AdminPage__backBtn" onClick={() => navigate("/")}>
          ← На главную
        </button>
      </div>

      {/* Статистика */}
      <div className="AdminPage__stats">
        {(["user", "moderator", "admin"] as Role[]).map((role) => (
          <div key={role} className="AdminPage__statCard">
            <div
              className="AdminPage__statBadge"
              style={{ background: ROLE_BADGE_COLORS[role] }}
            >
              {role}
            </div>
            <div className="AdminPage__statCount">
              {users.filter((u) => u.role === role).length}
            </div>
          </div>
        ))}
        <div className="AdminPage__statCard">
          <div className="AdminPage__statBadge" style={{ background: "#10b981" }}>
            всего
          </div>
          <div className="AdminPage__statCount">{users.length}</div>
        </div>
      </div>

      {successMsg && (
        <div className="AdminPage__success">{successMsg}</div>
      )}

      {/* Поиск */}
      <div className="AdminPage__searchBlock">
        <input
          className="AdminPage__search"
          type="text"
          placeholder="Поиск по email или роли..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Таблица пользователей */}
      <div className="AdminPage__tableBlock">
        {loading ? (
          <p className="AdminPage__loading">Загрузка пользователей...</p>
        ) : error ? (
          <p className="AdminPage__error">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="AdminPage__empty">Пользователи не найдены</p>
        ) : (
          <table className="AdminPage__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Изменить роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="AdminPage__row">
                  <td className="AdminPage__cell AdminPage__cell--id">#{user.id}</td>

                  <td className="AdminPage__cell">{user.email}</td>

                  <td className="AdminPage__cell">
                    <span
                      className="AdminPage__roleBadge"
                      style={{ background: ROLE_BADGE_COLORS[user.role] }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="AdminPage__cell">
                    <select
                      className="AdminPage__roleSelect"
                      value={user.role}
                      onChange={(e) =>
                        handleSetRole(user.id, e.target.value as Role)
                      }
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="AdminPage__cell">
                    <button
                      className="AdminPage__deleteBtn"
                      onClick={() => handleDeleteUser(user.id, user.email)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
// src/pages/profile/ProfilePage.tsx — обновлён для AuthContext
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ListeningPlayer from "../../components/ListeningPlayer";
import { useAuth } from "../../context/AuthContext";
import "./ProfilePage.css";

interface ListeningHistory {
  id: number;
  platform: string;
  nickname: string;
  startedAt: string;
  endedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface FavoriteChannel {
  id: number;
  platform: string;
  nickname: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [history, setHistory] = useState<ListeningHistory[]>([]);
  const [favorites, setFavorites] = useState<FavoriteChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [historyRes, favRes] = await Promise.all([
          hasPermission("history:read")
            ? axios.get("http://localhost:8080/api/listening-history", {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ data: [] }),
          hasPermission("favorites:read")
            ? axios.get("http://localhost:8080/api/favorite-channels", {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ data: [] }),
        ]);
        setHistory(historyRes.data || []);
        setFavorites(favRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hasPermission]);

  const startListening = async (platform: string, nickname: string) => {
    if (!hasPermission("tracking:start")) {
      alert("Недостаточно прав для запуска прослушки");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/start-tracking",
        { platform, identifier: nickname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("trackingData", JSON.stringify({ platform, nickname }));
      window.dispatchEvent(new Event("localStorageChanged"));
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.error || "Не удалось запустить прослушку");
    }
  };

  const toggleFavorite = async (channel: { platform: string; nickname: string }) => {
    if (!hasPermission("favorites:write")) {
      alert("Недостаточно прав для управления избранным");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const exists = favorites.some(
        (f) => f.platform === channel.platform && f.nickname === channel.nickname
      );
      if (exists) {
        await axios.delete("http://localhost:8080/api/favorite-channels", {
          data: { Platform: channel.platform, Nickname: channel.nickname },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) =>
          prev.filter(
            (f) => !(f.platform === channel.platform && f.nickname === channel.nickname)
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/favorite-channels",
          { Platform: channel.platform, Nickname: channel.nickname },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data?.id) {
          setFavorites((prev) => [...prev, response.data]);
        }
      }
    } catch (err: any) {
      console.error("Ошибка при работе с избранным:", err);
      alert("Ошибка при добавлении/удалении из избранного");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout");
    } catch {}
    logout();
    navigate("/login");
  };

  const formatSessionTime = (item: ListeningHistory) => {
    const start = new Date(item.startedAt);
    const startStr = start.toLocaleString("ru-RU", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!item.endedAt) {
      return <span className="ProfilePage__activeSession">{startStr} → активна</span>;
    }
    const end = new Date(item.endedAt);
    const endTime = end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    return <>{startStr} → {endTime}</>;
  };

  if (loading) return <div className="ProfilePage__loading">Загрузка...</div>;
  if (error) return <div className="ProfilePage__error">{error}</div>;

  return (
    <div className="ProfilePage">
      <ListeningPlayer />

      <div className="ProfilePage__container">
        {/* Карточка профиля */}
        <div className="ProfilePage__card">
          <div className="ProfilePage__avatar">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <h1 className="ProfilePage__title">Профиль</h1>
          <p className="ProfilePage__email">{user?.email}</p>

          {/* Отображение роли */}
          <div className="ProfilePage__roleInfo">
            Ваша роль:&nbsp;
            <span className="ProfilePage__roleBadge ProfilePage__roleBadge--{user?.role}">
              {user?.role ?? "—"}
            </span>
          </div>

          <button className="ProfilePage__logout" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        {/* Закреплённые каналы — только с правом favorites:read */}
        {hasPermission("favorites:read") && (
          <div className="ProfilePage__section">
            <h2 className="ProfilePage__sectionTitle">Закреплённые каналы</h2>
            {favorites.length === 0 ? (
              <p className="ProfilePage__empty">Нет закреплённых каналов</p>
            ) : (
              <div className="ProfilePage__favorites">
                {favorites.map((fav) => (
                  <div
                    key={`${fav.platform}-${fav.nickname}`}
                    className="ProfilePage__channelItem"
                  >
                    <div>
                      <strong>{fav.platform}</strong> • {fav.nickname}
                    </div>
                    <div className="ProfilePage__channelActions">
                      {hasPermission("tracking:start") && (
                        <button
                          onClick={() => startListening(fav.platform, fav.nickname)}
                          className="ProfilePage__playBtn"
                        >
                          Прослушать
                        </button>
                      )}
                      {hasPermission("favorites:write") && (
                        <button
                          onClick={() => toggleFavorite(fav)}
                          className="ProfilePage__unpinBtn"
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* История — только с правом history:read */}
        {hasPermission("history:read") && (
          <div className="ProfilePage__section">
            <div className="ProfilePage__sectionHeader">
              <h2 className="ProfilePage__sectionTitle">История прослушиваний</h2>
              {history.length > 0 && hasPermission("history:delete") && (
                <button
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Очистить всю историю прослушиваний?\nЭто действие нельзя отменить."
                      )
                    )
                      return;
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete("http://localhost:8080/api/listening-history", {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setHistory([]);
                    } catch {
                      alert("Не удалось очистить историю");
                    }
                  }}
                  className="ProfilePage__clearHistoryBtn"
                >
                  Очистить историю
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="ProfilePage__empty">История пуста</p>
            ) : (
              <div className="ProfilePage__history">
                {history.map((item) => {
                  const isFavorite = favorites.some(
                    (f) => f.platform === item.platform && f.nickname === item.nickname
                  );
                  return (
                    <div key={item.id} className="ProfilePage__historyItem">
                      <div className="ProfilePage__historyInfo">
                        <div className="ProfilePage__historyChannel">
                          <strong>{item.platform}</strong> • {item.nickname}
                        </div>
                        <div className="ProfilePage__historyDate">
                          {formatSessionTime(item)}
                        </div>
                      </div>
                      <div className="ProfilePage__historyActions">
                        {hasPermission("tracking:start") && (
                          <button
                            onClick={() => startListening(item.platform, item.nickname)}
                            className="ProfilePage__playBtn"
                          >
                            Прослушать
                          </button>
                        )}
                        {hasPermission("favorites:write") && (
                          <button
                            onClick={() =>
                              toggleFavorite({
                                platform: item.platform,
                                nickname: item.nickname,
                              })
                            }
                            className={isFavorite ? "ProfilePage__pinned" : "ProfilePage__pinBtn"}
                          >
                            {isFavorite ? "Закреплён" : "Закрепить"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
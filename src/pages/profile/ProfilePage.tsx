import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ListeningPlayer from "../../components/ListeningPlayer";
import "./ProfilePage.css";

interface ListeningHistory {
  id: number;
  platform: string;
  nickname: string;
  startedAt: string;
  endedAt: string | null;  // ← было ?string, стало string | null
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
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [history, setHistory] = useState<ListeningHistory[]>([]);
  const [favorites, setFavorites] = useState<FavoriteChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Загрузка данных профиля
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const [userRes, historyRes, favRes] = await Promise.all([
          axios.get("http://localhost:8080/api/user", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/api/listening-history", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/api/favorite-channels", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUser(userRes.data);
        setHistory(historyRes.data || []);
        setFavorites(favRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const startListening = async (platform: string, nickname: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/start-tracking",
        { 
          platform, 
          identifier: nickname   // ← именно identifier, а не nickname!
        },
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
    try {
      const token = localStorage.getItem("token");
      const exists = favorites.some(f => f.platform === channel.platform && f.nickname === channel.nickname);

      if (exists) {
        await axios.delete(`http://localhost:8080/api/favorite-channels`, {
          data: channel,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => prev.filter(f => !(f.platform === channel.platform && f.nickname === channel.nickname)));
      } else {
        await axios.post("http://localhost:8080/api/favorite-channels", channel, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(prev => [...prev, { id: Date.now(), ...channel }]);
      }
    } catch (err) {
      console.error("Ошибка с избранным", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("trackingData");
    window.dispatchEvent(new Event("localStorageChanged"));
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
    const endTime = end.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return <>{startStr} → {endTime}</>;
  };

  if (loading) return <div className="ProfilePage__loading">Загрузка...</div>;
  if (error) return <div className="ProfilePage__error">{error}</div>;

  return (
    <div className="ProfilePage">
      <ListeningPlayer />

      <div className="ProfilePage__container">
        {/* Профиль */}
        <div className="ProfilePage__card">
          <div className="ProfilePage__avatar">{user?.email.charAt(0).toUpperCase()}</div>
          <h1 className="ProfilePage__title">Профиль</h1>
          <p className="ProfilePage__email">{user?.email}</p>
          <button className="ProfilePage__logout" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        {/* Закреплённые каналы */}
        <div className="ProfilePage__section">
          <h2 className="ProfilePage__sectionTitle">Закреплённые каналы</h2>
          {favorites.length === 0 ? (
            <p className="ProfilePage__empty">Нет закреплённых каналов</p>
          ) : (
            <div className="ProfilePage__favorites">
              {favorites.map((fav) => (
                <div key={`${fav.platform}-${fav.nickname}`} className="ProfilePage__channelItem">
                  <div>
                    <strong>{fav.platform}</strong> • {fav.nickname}
                  </div>
                  <div className="ProfilePage__channelActions">
                    <button onClick={() => startListening(fav.platform, fav.nickname)} className="ProfilePage__playBtn">
                      Прослушать
                    </button>
                    <button onClick={() => toggleFavorite(fav)} className="ProfilePage__unpinBtn">
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* История прослушиваний */}
        <div className="ProfilePage__section">
          <h2 className="ProfilePage__sectionTitle">История прослушиваний</h2>
          {history.length === 0 ? (
            <p className="ProfilePage__empty">История пуста</p>
          ) : (
            <div className="ProfilePage__history">
              {history.map((item) => {
                const isFavorite = favorites.some(f => f.platform === item.platform && f.nickname === item.nickname);
                return (
                  <div key={item.id} className="ProfilePage__historyItem">
                    <div>
                      <div className="ProfilePage__historyChannel">
                        {item.platform} • {item.nickname}
                      </div>
                      <div className="ProfilePage__historyDate">
  {formatSessionTime(item)}
</div>
                    </div>
                    <div className="ProfilePage__historyActions">
                      <button onClick={() => startListening(item.platform, item.nickname)} className="ProfilePage__playBtn">
                        Прослушать
                      </button>
                      <button
                        onClick={() => toggleFavorite({ platform: item.platform, nickname: item.nickname })}
                        className={isFavorite ? "ProfilePage__pinned" : "ProfilePage__pinBtn"}
                      >
                        {isFavorite ? "Закреплён" : "Закрепить"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TwitchDashboard.css";

interface TrackingData {
  platform: string;
  nickname: string;
}

interface Message {
  id: number;
  text: string;
  username: string;
  label?: number;
}

const TwitchDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Инициализация данных отслеживания
  useEffect(() => {
    let active = true;
    let data: TrackingData | null = null;
    let interval: any;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    } [navigate]
  
    // 1️⃣ location.state
    const stateData = location.state as TrackingData | undefined;
    if (stateData?.platform && stateData?.nickname) {
      data = stateData;
      localStorage.setItem("trackingData", JSON.stringify(data));
    } else {
      // 2️⃣ localStorage
      const stored = localStorage.getItem("trackingData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.platform && parsed.nickname) data = parsed;
        } catch {
          localStorage.removeItem("trackingData");
        }
      }
    }
  
    // 3️⃣ если данных нет — редирект
    if (!data) {
      console.warn("Нет trackingData — перенаправление на выбор платформы");
      navigate("/platform-select");
      return;
    }
    window.dispatchEvent(new Event("localStorageChanged"));
  
    setTrackingData(data);
  
    // 4️⃣ подгружаем сообщения и запускаем polling
    const startPolling = async () => {
      await fetchMessages();
      if (!active) return;
      interval = setInterval(fetchMessages, 3000);
    };
  
    startPolling();
  
    // 5️⃣ cleanup — очищаем всё
    return () => {
      active = false;
      if (interval) clearInterval(interval);
    };
  }, [location.state, navigate]);

  // Получение сообщений с сервера
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/problematic-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    } catch (err: any) {
      console.error("Ошибка при загрузке сообщений:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Завершение сессии
  const handleEndSession = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/stop-tracking", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Ошибка при остановке отслеживания:", err);
    } finally {
      localStorage.removeItem("trackingData");
      navigate("/platform-select");
    }
  };

  // 5️⃣ Пока нет данных (рендер после навигации)
  if (!trackingData) {
    return (
      <div className="dashboard">
        <p className="dashboard__loading">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Мониторинг чата</h1>
      <p className="dashboard__platform">Платформа: {trackingData.platform}</p>
      <p className="dashboard__channel">Канал: {trackingData.nickname}</p>

      <div className="dashboard__messages-block">
        <h2 className="dashboard__messages-title">Проблемные сообщения</h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : messages.length > 0 ? (
          <div className="dashboard__messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className="dashboard__message">
                <span className="dashboard__message-text">{msg.text}</span>
                <span className="dashboard__message-username">— {msg.username}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard__no-messages">Проблемных сообщений пока нет</p>
        )}
      </div>

      <button className="dashboard__end-button" onClick={handleEndSession}>
        Завершить сессию
      </button>
    </div>
  );
};

export default TwitchDashboard;
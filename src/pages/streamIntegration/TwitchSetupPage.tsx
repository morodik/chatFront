import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TwitchSetupPage.css";
import axios from "axios";
import Navbar from "../../components/Navbar";

const StreamConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);

  // Проверка авторизации (если нужно)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Получаем платформу из location.state
  useEffect(() => {
    const statePlatform = (location.state as { platform?: string })?.platform;
    if (!statePlatform) {
      alert("Платформа не выбрана");
      navigate("/platform-select");
    } else {
      setPlatform(statePlatform);
    }
  }, [location.state, navigate]);


const handleStartTracking = async () => {
  if (!nickname.trim()) {
    alert("Введите никнейм");
    return;
  }

  if (!platform) return;
  

  const payload = {
    platform: platform,        // "twitch" | "youtube"
    identifier: nickname,      // ник или URL
  };

  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:8080/api/start-tracking",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const trackingData = { platform, nickname };
    localStorage.setItem("trackingData", JSON.stringify(trackingData));
    navigate("/dashboard", { state: trackingData });
  } catch (err: any) {
    console.error("Ошибка:", err.response?.data);
    alert(err.response?.data?.error || "Не удалось запустить отслеживание");
  }
};

  if (!platform) return null;

  return (
    <div className="StreamConfigPage">
      <Navbar />
      <button className="BackButton" onClick={() => navigate("/platform-select")}>
  ← Назад
</button>
      <h1 className="StreamConfigPage__title">Выберите платформу</h1>
      <p className="StreamConfigPage__subtitle">
        Автоматический анализ сообщений в чате и мгновенное оповещение о сбоях в работе
      </p>

      <div className="StreamConfigPage__configBlock">
        <div className="StreamConfigPage__platformLabel">{platform}</div>
        <label className="StreamConfigPage__nicknameLabel">Введите ник</label>
        <input
          type="text"
          className="StreamConfigPage__nicknameInput"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="LenaGolOvach..."
        />
      </div>

      <button className="StreamConfigPage__startButton" onClick={handleStartTracking}>
        Начать отслеживать
      </button>
    </div>
  );
};

export default StreamConfigPage;
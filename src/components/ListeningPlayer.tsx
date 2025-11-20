// src/components/ListeningPlayer.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListeningPlayer.css";

const ListeningPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [trackingData, setTrackingData] = useState<{ platform: string; nickname: string } | null>(null);

  useEffect(() => {
    const updateTracking = () => {
      const stored = localStorage.getItem("trackingData");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data.platform && data.nickname) {
            setTrackingData(data);
            return;
          }
        } catch (e) {
          console.error("Ошибка парсинга trackingData", e);
        }
      }
      setTrackingData(null);
    };

    // Первичная загрузка
    updateTracking();

    // Слушаем изменения localStorage от других вкладок
    window.addEventListener("storage", (e) => {
      if (e.key === "trackingData" || e.key === "token") {
        updateTracking();
      }
    });

    // Слушаем кастомное событие внутри одной вкладки
    const handleLocalChange = () => updateTracking();
    window.addEventListener("localStorageChanged", handleLocalChange);

    // Очистка
    return () => {
      window.removeEventListener("storage", updateTracking);
      window.removeEventListener("localStorageChanged", handleLocalChange);
    };
  }, []);

  if (!trackingData) return null;

  return (
    <div className="ListeningPlayer" onClick={() => navigate("/dashboard")}>
      <div className="ListeningPlayer__pulse"></div>
      <div className="ListeningPlayer__content">
        <span className="ListeningPlayer__status">Прослушивание</span>
        <span className="ListeningPlayer__info">
          {trackingData.platform} • {trackingData.nickname}
        </span>
      </div>
      <div className="ListeningPlayer__wave">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default ListeningPlayer;
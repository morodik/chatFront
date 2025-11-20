import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlatformSelect.css";

const PlatformSelectPage: React.FC = () => {
  
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleSelect = (platform: string) => setSelectedPlatform(platform);

  const handleSubmit = () => {
    if (!selectedPlatform) {
      alert("Пожалуйста, выберите платформу");
      return;
    }

    navigate("/twitch", { state: { platform: selectedPlatform } });
  };

  return (
    <div className="PlatformPage">
      <h1 className="PlatformPage__title">Выберите платформу</h1>
      <p className="PlatformPage__subtitle">
        Автоматический анализ сообщений в чате и мгновенное оповещение о сбоях в работе
      </p>

      <div className="PlatformPage__platformBlock">
        <div
          className={`PlatformPage__option ${selectedPlatform === "twitch" ? "active" : ""}`}
          onClick={() => handleSelect("twitch")}
        >
          Twitch
        </div>
        <div
          className={`PlatformPage__option ${selectedPlatform === "youtube" ? "active" : ""}`}
          onClick={() => handleSelect("youtube")}
        >
          YouTube
        </div>
        <div
          className={`PlatformPage__option ${selectedPlatform === "kick" ? "active" : ""}`}
          onClick={() => handleSelect("kick")}
        >
          Kick
        </div>
      </div>

      <button className="PlatformPage__button" onClick={handleSubmit}>
        Выбрать
      </button>
    </div>
  );
};

export default PlatformSelectPage;
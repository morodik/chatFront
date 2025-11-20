// WelcomePage.tsx — ЧИСТАЯ ВЕРСИЯ (без темы)
import React from "react";
import { Link } from "react-router-dom";
import MessageItem from "./MessageItem";
import "./WelcomePage.css";
import ListeningPlayer from "../../components/ListeningPlayer";

const WelcomePage: React.FC = () => {
  const isAuth = !!localStorage.getItem("token");

  return (
    <div className="WelcomePage">
      <ListeningPlayer />   {/* ← вот здесь, внизу */}
      <h1 className="WelcomePage__title">
        Быстро узнайте о проблемах с трансляцией
      </h1>
      <p className="WelcomePage__subtitle">
        Автоматический анализ сообщений в чате и мгновенное оповещение о сбоях в работе
      </p>

      <div className="WelcomePage__messagesBlock">
        <MessageItem nick="morodik" text="F" />
        <MessageItem nick="user123" text="Ошибка трансляции" />
        <MessageItem nick="streamer42" text="Лагает звук" />
      </div>

      <Link
        to={isAuth ? "/platform-select" : "/login"}
        className="WelcomePage__streamButton"
      >
        <span className="WelcomePage__streamButtonText">
          Интеграция со стримом
        </span>
      </Link>
    </div>
  );
};

export default WelcomePage;
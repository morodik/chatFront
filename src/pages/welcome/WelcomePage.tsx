import React from "react";
import "./WelcomePage.css";
import { Link } from "react-router-dom";
import MessageItem from "./MessageItem";

const WelcomePage: React.FC = () => {
  return (
    <div className="WelcomePage">
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

      <h2 className="WelcomePage__messagesTitle">
        Последние сообщения о проблемах
      </h2>

      <Link to="/login" className="WelcomePage__streamButton">
        <span className="WelcomePage__streamButtonText">
          Интеграция со стримом
        </span>
      </Link>
    </div>
  );
};

export default WelcomePage;
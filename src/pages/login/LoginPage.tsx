import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token); // Сохраняем токен
      setError("");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка входа");
    }
  };

  return (
    <div className="LoginPage">
      <button className="BackButton" onClick={() => navigate("/")}>
  ← Назад
</button>
      <div className="LoginPage__formBlock">
        <form className="LoginPage__form" onSubmit={handleSubmit}>
          <h1 className="LoginPage__title">Вход</h1>
          {error && <p className="LoginPage__error">{error}</p>}
          <label className="LoginPage__label" htmlFor="email">
            Почта
          </label>
          <input
            type="email"
            id="email"
            className="LoginPage__input"
            placeholder="Введите почту"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="LoginPage__label LoginPage__label--password" htmlFor="password">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            className="LoginPage__input LoginPage__input--password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="LoginPage__button">
            Войти
          </button>
          <p className="LoginPage__or">или</p>
          <Link to="/register" className="LoginPage__registerLink">
            Зарегистрироваться
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";


const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    navigate("/profile"); 
  };

  return (
    <div className="LoginPage">
      <div className="LoginPage__formBlock">
        <form className="LoginPage__form" onSubmit={handleSubmit}>
          <h1 className="LoginPage__title">Вход</h1>

          <label className="LoginPage__label" htmlFor="email">
            Почта
          </label>
          <input
            type="email"
            id="email"
            className="LoginPage__input"
            placeholder="Введите почту"
          />

          <label
            className="LoginPage__label LoginPage__label--password"
            htmlFor="password"
          >
            Пароль
          </label>
          <input
            type="password"
            id="password"
            className="LoginPage__input LoginPage__input--password"
            placeholder="Введите пароль"
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
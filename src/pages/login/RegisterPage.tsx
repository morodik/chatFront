import React from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage: React.FC = () => {
  return (
    <div className="RegisterPage">
      <div className="RegisterPage__formBlock">
        <form className="RegisterPage__form">
          <h1 className="RegisterPage__title">Регистрация</h1>


          <label className="RegisterPage__label" htmlFor="email">
            Почта
          </label>
          <input
            type="email"
            id="email"
            className="RegisterPage__input"
            placeholder="Введите почту"
          />


          <label
            className="RegisterPage__label RegisterPage__label--password"
            htmlFor="password"
          >
            Пароль
          </label>
          <input
            type="password"
            id="password"
            className="RegisterPage__input RegisterPage__input--password"
            placeholder="Введите пароль"
          />


          <label
            className="RegisterPage__label RegisterPage__label--repeat"
            htmlFor="repeatPassword"
          >
            Повторите пароль
          </label>
          <input
            type="password"
            id="repeatPassword"
            className="RegisterPage__input RegisterPage__input--repeat"
            placeholder="Повторите пароль"
          />


          <button type="submit" className="RegisterPage__button">
            Зарегистрироваться
          </button>


          <p className="RegisterPage__or">или</p>


          <Link to="/login" className="RegisterPage__loginLink">
            Войти
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [passwordsMismatch, setPasswordsMismatch] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setPasswordsMismatch(false); // сбрасываем для повторного срабатывания анимации
      setTimeout(() => setPasswordsMismatch(true), 10); // включаем анимацию
      return;
    }
  
    try {
      await axios.post("http://localhost:8080/register", {
        email,
        password,
        confirm_password: confirmPassword,
      });
      setError("");
      setPasswordsMismatch(false);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка регистрации");
    }
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordsMismatch && value === confirmPassword) {
      setPasswordsMismatch(false); // выключаем подсветку, если теперь совпадает
    }
  };
  
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (passwordsMismatch && password === value) {
      setPasswordsMismatch(false); // выключаем подсветку, если теперь совпадает
    }
  };
  

  return (
    <div className="RegisterPage">
      <div className="RegisterPage__formBlock">
        <form className="RegisterPage__form" onSubmit={handleSubmit}>
          <h1 className="RegisterPage__title">Регистрация</h1>
          {error && <p className="RegisterPage__error">{error}</p>}
          <label className="RegisterPage__label" htmlFor="email">
            Почта
          </label>
          <input
            type="email"
            id="email"
            className="RegisterPage__input"
            placeholder="Введите почту"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
  className={`RegisterPage__input RegisterPage__input--password 
              ${passwordsMismatch ? "RegisterPage__input--error RegisterPage__input--shake" : ""}`}
  placeholder="Введите пароль"
  value={password}
  onChange={(e) => handlePasswordChange(e.target.value)}
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
  className={`RegisterPage__input RegisterPage__input--repeat 
              ${passwordsMismatch ? "RegisterPage__input--error RegisterPage__input--shake" : ""}`}
  placeholder="Повторите пароль"
  value={confirmPassword}
  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
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
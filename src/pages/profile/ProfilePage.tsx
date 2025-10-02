import React, { useState } from "react";
import "./ProfilePage.css";


const ProfilePage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__formBlock">
        <h1 className="ProfilePage__title">Профиль</h1>


        <label className="ProfilePage__label" htmlFor="email">
          Почта
        </label>
        <div className="ProfilePage__inputWrapper">
          <input
            type="email"
            id="email"
            className="ProfilePage__input"
            placeholder="user@example.com"
            value="user@example.com"
            readOnly
          />
        </div>


        <label className="ProfilePage__label ProfilePage__label--password" htmlFor="password">
          Пароль
        </label>
        <div className="ProfilePage__passwordWrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="ProfilePage__input ProfilePage__input--password"
            value="secret123"
            readOnly
          />
          <button
            type="button"
            className="ProfilePage__showButton"
            onClick={togglePassword}
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
import React from "react";
//import "./StreamButton.css";

interface StreamButtonProps {
  text: string;
  onClick?: () => void;
}

const StreamButton: React.FC<StreamButtonProps> = ({ text, onClick }) => {
  return (
    <button className="StreamButton" onClick={onClick}>
      {text}
    </button>
  );
};

export default StreamButton;
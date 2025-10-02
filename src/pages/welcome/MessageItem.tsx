import React from "react";
import "./WelcomePage.css";

interface MessageItemProps {
  nick: string;
  text: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ nick, text }) => {
  return (
    <div className="WelcomePage__messageItem">
      <span className="WelcomePage__messageNick">{nick}</span>
      <span className="WelcomePage__messageText">{text}</span>
    </div>
  );
};

export default MessageItem;
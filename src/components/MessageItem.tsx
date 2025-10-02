import React from "react";
//import "./MessageItem.css";

interface MessageItemProps {
  flag: string; 
  nick: string;
  text?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ flag, nick, text }) => {
  return (
    <div className="MessageItem">
      <span className="MessageItem__flag">{flag}</span>
      <span className="MessageItem__nick">{nick}</span>
      {text && <span className="MessageItem__text">{text}</span>}
    </div>
  );
};

export default MessageItem;
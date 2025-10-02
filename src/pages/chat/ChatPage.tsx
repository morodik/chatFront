import React, { useState } from "react";
import "./ChatPage.css";

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage) return;
    const message: ChatMessage = {
      id: Date.now(),
      sender: "Я",
      text: newMessage,
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="ChatPage">
      <h1 className="ChatPage__title">Чат уведомлений</h1>

      <div className="ChatPage__messagesBlock">
        {messages.map((msg) => (
          <div key={msg.id} className="ChatPage__messageItem">
            <span className="ChatPage__messageSender">{msg.sender}:</span>
            <span className="ChatPage__messageText">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="ChatPage__inputBlock">
        <input
          className="ChatPage__input"
          placeholder="Введите сообщение"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="ChatPage__sendButton" onClick={handleSend}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
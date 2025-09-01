import React, { FC, useEffect, useState } from "react";

import "./NotificationCenter.css";

const NotificationCenter: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8080");
    setWs(webSocket);
    // Open a connection to websocket server
    webSocket.onopen = () => {
      console.log("Connected to websocket server");
    };
    // Receive the messages from websocket server
    webSocket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data
          .text()
          .then((text) => {
            const newMessage = text;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          })
          .catch((error) => {
            console.error("Error reading Blob:", error);
          });
      } else {
        const newMessage = event.data;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    // WebSocket errors
    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    // Close the connection to websocket server
    webSocket.onclose = () => {
      console.log("Disconnected from websocket server");
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(input);
      setInput("");
    }
  };

  return (
    <div className="notification-center">
      <h2>Real-Time Notifications</h2>
      <div className="messages">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default NotificationCenter;

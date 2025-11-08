import React, { useState } from "react";
import "../../TravelerManagement.css";
import { mockGuideChat, mockAdminChat } from "../../mockData/ChatData";

function ChatBoxSection() {
  const [activeChat, setActiveChat] = useState("guide");
  const [messages, setMessages] = useState(mockGuideChat);
  const [newMessage, setNewMessage] = useState("");

  // Chat room list (left sidebar)
const bookingId = "TRV-82345";
const chatRooms = [
  {
    key: "guide",
    bookingId,
    name: `Travor ID ${bookingId}`, 
    subtext: "Vancouver City 4HRS Walking Tour",
    avatar: "/avatars/travor.png",
    lastMsg: mockGuideChat[mockGuideChat.length - 1]?.text || "Tap to open chat...",
    time: "09:15 AM",
  },
   {
      key: "admin",
      name: "Platform Admin",
      subtext: "Customer Support",
      bookingId: "#Support",
      avatar: "/avatars/admin.png",
      lastMsg:
        mockAdminChat[mockAdminChat.length - 1]?.text || "Tap to open chat...",
      time: "10:25 AM",
    },
];
  // Handle switching between chatrooms
  const handleSwitchChat = (chatType) => {
    setActiveChat(chatType);
    setMessages(chatType === "guide" ? mockGuideChat : mockAdminChat);
  };

  // Handle sending a new message
  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      sender: "You",
      avatar: "/avatars/pia.png",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate a reply from Travor or Admin
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: activeChat === "guide" ? "Travor" : "Admin",
        avatar:
          activeChat === "guide"
            ? "/avatars/travor.png"
            : "/avatars/admin.png",
        text:
          activeChat === "guide"
            ? "Got it, Pia! See you at Waterfront Station 👍"
            : "Thanks Pia, our support team will check that for you.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="section-content chat-layout">
      {/* ---------- LEFT SIDEBAR ---------- */}
      <aside className="chat-sidebar">
        <h3 className="chat-sidebar-title">Chats</h3>

        {chatRooms.map((room) => (
          <div
            key={room.key}
            className={`chat-room ${activeChat === room.key ? "active" : ""}`}
            onClick={() => handleSwitchChat(room.key)}
          >
            <div className="chat-avatar">
              <img src={room.avatar} alt={room.name} />
            </div>
            <div className="chat-room-details">
              <div className="chat-room-header">
                <h4>{room.name}</h4>
                <span className="chat-time">{room.time}</span>
              </div>
              <p className="chat-subtext">{room.subtext}</p>
              <p className="chat-preview">{room.lastMsg}</p>
            </div>
          </div>
        ))}
      </aside>

      {/* ---------- RIGHT CHAT PANEL ---------- */}
      <main className="chat-main">
        {/* Banner for guide chat */}
        {activeChat === "guide" && (
          <div className="chat-banner">
            ⚠️ <strong>Safety Reminder:</strong> Do not share personal contact info or make
            payments outside Travor.
            <br />
            Booking ID: <span className="booking-id">TRV-82345</span> | Vancouver City 4HRS
            Walking Tour
          </div>
        )}

        {/* Chat messages */}
        <div className="chatbox-window">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.sender === "You"
                  ? "chat-you"
                  : msg.sender === "Admin"
                  ? "chat-admin"
                  : "chat-travor"
              }`}
            >
              {msg.sender !== "You" && (
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="chat-avatar-inline"
                />
              )}
              <div className="chat-bubble">
                <p>{msg.text}</p>
                <span className="chat-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="chatbox-input">
          <input
            type="text"
            placeholder={
              activeChat === "guide"
                ? "Message Travor..."
                : "Message Admin..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default ChatBoxSection;

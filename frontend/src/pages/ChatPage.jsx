import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import bgvid from "../assets/bgvid.mp4";
import "../pages/chat.css";

function LoadingDots() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setDots(".".repeat(count));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return <span className="loading-dots">{dots}</span>;
}

const LS_KEY = "plantDoctorChatsV2";
const LS_SELECTED = "plantDoctorSelectedChatV2";
const uniqueId = () => "chat_" + Math.random().toString(36).substring(2, 10);

export default function ChatPage() {
  const [chats, setChats] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return [
      {
        id: uniqueId(),
        name: "Chat 1",
        messages: [
          {
            id: uniqueId(),
            sender: "bot",
            text: "Hi! 🌱 Ask me anything about plants, gardening, or plant facts!",
          },
        ],
      },
    ];
  });

  const [selectedChatId, setSelectedChatId] = useState(() => {
    const savedId = localStorage.getItem(LS_SELECTED);
    if (savedId && chats.some((c) => c.id === savedId)) return savedId;
    return chats[0]?.id || null;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(() => window.innerWidth > 700);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (selectedChatId) {
      localStorage.setItem(LS_SELECTED, selectedChatId);
    }
  }, [selectedChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selectedChatId, loading]);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 700;
      setSliderOpen(isLarge);
      if (!isLarge && renamingId) finishRename(renamingId);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renamingId]);

  const selectedChat = chats.find((c) => c.id === selectedChatId) || null;

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading || !selectedChat) return;

    const userMsg = {
      id: uniqueId(),
      sender: "user",
      text: input.trim(),
    };
    const updatedHistory = [...selectedChat.messages, userMsg];

    setChats((prev) =>
      prev.map((c) => (c.id === selectedChat.id ? { ...c, messages: updatedHistory } : c))
    );
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          memory: updatedHistory,
        }),
      });
      const data = await response.json();
      const replyText = data.reply || "Sorry, no response.";
      const botMsg = {
        id: uniqueId(),
        sender: "bot",
        text: replyText,
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChat.id ? { ...c, messages: [...c.messages, botMsg] } : c
        )
      );
    } catch {
      const errMsg = {
        id: uniqueId(),
        sender: "bot",
        text: "Error contacting server.",
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChat.id ? { ...c, messages: [...c.messages, errMsg] } : c
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    const newChat = {
      id: uniqueId(),
      name: `Chat ${chats.length + 1}`,
      messages: [
        {
          id: uniqueId(),
          sender: "bot",
          text: "Hi! 🌱 Ask me anything about plants, gardening, or plant facts!",
        },
      ],
    };
    setChats((prev) => [...prev, newChat]);
    setSelectedChatId(newChat.id);
    setSliderOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function handleDeleteChat(id) {
    const filtered = chats.filter((c) => c.id !== id);
    setChats(filtered);
    if (id === selectedChatId) {
      setSelectedChatId(filtered[0]?.id || null);
    }
  }

  function startRename(id, currentName) {
    setRenamingId(id);
    setRenameValue(currentName);
  }

  function finishRename(id) {
    setChats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: renameValue.trim() || c.name } : c
      )
    );
    setRenamingId(null);
    setRenameValue("");
  }

  const handleKeyDown = (e, chat, index) => {
    switch (e.key) {
      case "Enter":
        setSelectedChatId(chat.id);
        break;
      case "ArrowDown":
        e.preventDefault();
        itemRefs.current[(index + 1) % chats.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        itemRefs.current[(index - 1 + chats.length) % chats.length]?.focus();
        break;
      case "Escape":
        if (renamingId) finishRename(renamingId);
        break;
      default:
        break;
    }
  };

  const showOverlay = sliderOpen && window.innerWidth <= 700;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background video with blur, just like Home */}
      <video
        className="background-video"
        src={bgvid}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="black-fade-overlay" />

      {/* Main container */}
      <div className="chatgpt-root" style={{ position: "relative", margin: "40px auto" }}>
        {/* Sidebar */}
        <aside className={`chatgpt-slider${sliderOpen ? " open" : " closed"}`} aria-label="Chat history sidebar">
          <div className="chatgpt-slider-header">
            <span>💬 Chats</span>
            <div className="chatgpt-slider-header-btns">
              <button onClick={handleNewChat} title="New Chat">＋</button>
              <button onClick={() => setSliderOpen(false)} title="Collapse Sidebar">←</button>
            </div>
          </div>
          <div className="chatgpt-slider-list" role="listbox">
            {chats.map((chat, idx) => {
              const isSelected = chat.id === selectedChatId;
              return (
                <div
                  key={chat.id}
                  className={`chatgpt-slider-item${isSelected ? " selected" : ""}`}
                  onClick={() => setSelectedChatId(chat.id)}
                  tabIndex={0}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onKeyDown={(e) => handleKeyDown(e, chat, idx)}
                >
                  {renamingId === chat.id ? (
                    <input
                      className="chatgpt-rename-input"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => finishRename(chat.id)}
                      onKeyDown={(e) => e.key === "Enter" && finishRename(chat.id)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <span onDoubleClick={() => startRename(chat.id, chat.name)}>
                        {chat.name}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); startRename(chat.id, chat.name); }}
                        className="chatgpt-slider-edit"
                        title="Rename"
                      >
                        <img src={editIcon} alt="Rename" className="edit-icon" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                        className="chatgpt-slider-delete"
                        title="Delete"
                      >
                        <img src={deleteIcon} alt="Delete" className="delete-icon" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Sidebar toggle */}
        <button
          className={`chatgpt-slider-toggle${!sliderOpen ? " visible" : ""}`}
          onClick={() => {
            setSliderOpen(true);
            setTimeout(() => itemRefs.current[0]?.focus(), 100);
          }}
        >
          →
        </button>

        {showOverlay && (
          <div className="chatgpt-slider-overlay" onClick={() => setSliderOpen(false)} />
        )}

        {/* Chat main area */}
        <main className="chatgpt-main">
          <header className="chatgpt-main-header">
            <h2>{selectedChat?.name || "No Chat Selected"}</h2>
          </header>

          <section className="chat-box">
            {selectedChat?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot-bubble">
                <LoadingDots />
              </div>
            )}
            <div ref={chatEndRef} />
          </section>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask about plants..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              ref={inputRef}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? <LoadingDots /> : "Send"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

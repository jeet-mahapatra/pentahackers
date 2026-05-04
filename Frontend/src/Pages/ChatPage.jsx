

import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext"; // adjust path if needed
const SOCKET_URL = "http://localhost:3000";
const API_URL = "http://localhost:3000/api";

// ─── Utility ──────────────────────────────────────────────────
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

// ─── KEY FIX: Robust ID extractor ─────────────────────────────
// currentUser may have .id (string from JWT) or ._id (MongoDB ObjectId)
// Message senderId may be a string or a populated object with ._id
const extractId = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val._id) return String(val._id);
    if (val.id) return String(val.id);
  }
  return String(val);
};
// Returns true if the message was sent by the current user
const checkIsMine = (msg, currentUser) => {
  const myId =
    extractId(currentUser?.id) || extractId(currentUser?._id);

  const senderId = extractId(msg.senderId);

  if (!myId || !senderId) return false;

  return String(senderId) === String(myId);
};

// ─── Avatar ───────────────────────────────────────────────────
const Avatar = ({ name, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ring-slate-700`}
    >
      {(name?.[0] || "?").toUpperCase()}
    </div>
  );
};

// ─── Conversation Item ─────────────────────────────────────────
const ConversationItem = ({ conv, isActive, currentUserId, onSelect }) => {
  const other =
    extractId(conv.serviceUser?._id) === extractId(currentUserId)
      ? conv.serviceProvider
      : conv.serviceUser;

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(conv)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 relative ${
        isActive
          ? "bg-violet-600/20 border border-violet-500/30"
          : "hover:bg-slate-700/50 border border-transparent"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-r-full bg-violet-500"
        />
      )}
      <Avatar name={other?.username} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100 truncate">
          {other?.username || "Unknown"}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {conv.lastMessage
            ? conv.lastMessage.message.length > 32
              ? conv.lastMessage.message.slice(0, 32) + "…"
              : conv.lastMessage.message
            : "No messages yet"}
        </p>
      </div>
    </motion.button>
  );
};


// ─── Typing Indicator ─────────────────────────────────────────
 const TypingIndicator = () => (
  <motion.div className="flex items-end gap-2 mb-1">
    <div className="bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3 flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Message Bubble ────────────────────────────────────────────
const MessageBubble = ({ msg, isMine }) => (
  <motion.div
    className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[65%] px-4 py-2.5 rounded-2xl ${
        isMine
          ? "bg-violet-600 text-white"
          : "bg-slate-700 text-slate-100"
      }`}
    >
      <p>{msg.message}</p>
      <span className="text-xs opacity-60">
        {formatTime(msg.createdAt)}
      </span>
    </div>
  </motion.div>
);


// ─── Empty State ───────────────────────────────────────────────
const EmptyState = ({ icon, title, sub }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl"
    >
      {icon}
    </motion.div>
    <p className="text-slate-300 font-medium text-sm">{title}</p>
    <p className="text-slate-500 text-xs">{sub}</p>
  </div>
);

// ─── Spinner ───────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-2 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
  </div>
);

// ─── Main ChatPage ─────────────────────────────────────────────
export default function ChatPage() {
 const { user: currentUser, loading: userLoading } = useContext(UserContext);
  if (userLoading || !currentUser) return null;
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessError, setAccessError] = useState(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);

  // ── Auto-resize textarea ─────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  // ── Scroll to bottom ─────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherTyping]);

  // ── Socket setup ─────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("receive_message", (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.appointmentId === msg.appointmentId
            ? { ...c, lastMessage: msg }
            : c
        )
      );
    });

    socket.on("user_typing", () => setOtherTyping(true));
    socket.on("user_stop_typing", () => setOtherTyping(false));
    socket.on("error", (err) => setAccessError(err.message));

    return () => socket.disconnect();
  }, []);

  // ── Load conversations ────────────────────────────────────────
  useEffect(() => {
    axios
      .get(`${API_URL}/chat/conversations`, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) setConversations(data.conversations);
      })
      .catch(console.error);
  }, []);

  // ── Select conversation ───────────────────────────────────────
  const handleSelectConv = async (conv) => {
    setAccessError(null);
    setMessages([]);
    setActiveConv(conv);
    if (window.innerWidth < 768) setSidebarOpen(false);

    try {
      const accessRes = await axios.get(
        `${API_URL}/chat/access/${conv.appointmentId}`,
        { withCredentials: true }
      );
      setCanSendMessage(accessRes.data.canSendMessage !== false);

      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/chat/history/${conv.appointmentId}`,
        { withCredentials: true }
      );
      if (data.success) setMessages(data.messages);
      setLoading(false);

      socketRef.current?.emit("join_room", {
        appointmentId: conv.appointmentId,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.appointmentId === conv.appointmentId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );

      setTimeout(() => textareaRef.current?.focus(), 100);
    } catch (err) {
      setLoading(false);
      setAccessError(
        err.response?.data?.message || "Unable to access this chat"
      );
    }
  };

  // ── Send message ─────────────────────────────────────────────
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeConv) return;

    socketRef.current?.emit("send_message", {
      appointmentId: activeConv.appointmentId,
      message: trimmed,
    });

    setInput("");
    clearTimeout(typingTimeout.current);
    socketRef.current?.emit("stop_typing", {
      appointmentId: activeConv.appointmentId,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Typing indicator ─────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!activeConv) return;
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current?.emit("typing", {
        appointmentId: activeConv.appointmentId,
      });
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit("stop_typing", {
        appointmentId: activeConv.appointmentId,
      });
    }, 1500);
  };

  // ── Get other user name ───────────────────────────────────────
  const getOtherName = (conv) => {
    if (!conv) return "";
    const myId = extractId(currentUser?._id) ?? extractId(currentUser?.id);
    const other =
      extractId(conv.serviceUser?._id) === myId
        ? conv.serviceProvider
        : conv.serviceUser;
    return other?.username || "Unknown";
  };

  // ── Date grouping ─────────────────────────────────────────────
  const getDateLabel = (msg, idx) => {
    if (idx === 0) return formatDate(msg.createdAt);
    const prev = messages[idx - 1];
    if (
      new Date(prev.createdAt).toDateString() !==
      new Date(msg.createdAt).toDateString()
    )
      return formatDate(msg.createdAt);
    return null;
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">

      {/* ── MOBILE OVERLAY ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-20"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed md:relative z-30 md:z-auto h-full
          w-72 flex flex-col
          bg-slate-800 border-r border-slate-700
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar header */}
        <div className="px-5 py-5 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Messages</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Accepted appointments</p>
            </div>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-slate-500 text-xs leading-relaxed">
                No active chats yet.<br />
                Chat unlocks when a provider accepts your appointment.
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.appointmentId}
                conv={conv}
                isActive={activeConv?.appointmentId === conv.appointmentId}
                currentUserId={extractId(currentUser?._id) ?? extractId(currentUser?.id)}
                onSelect={handleSelectConv}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── MAIN CHAT ── */}
      <main className="flex-1 flex flex-col min-w-0 relative">

        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #475569 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── HEADER ── */}
        <div className="relative z-10 flex items-center gap-3 px-5 py-4 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {activeConv ? (
            <>
              <Avatar name={getOtherName(activeConv)} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {getOtherName(activeConv)}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[11px] text-emerald-400 font-medium truncate">
                    {activeConv.requestType}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Select a conversation to start chatting
            </p>
          )}
        </div>

        {/* ── ERROR BANNER ── */}
        <AnimatePresence>
          {accessError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="relative z-10 mx-5 mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs flex-shrink-0"
            >
              ⚠ {accessError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MESSAGES / EMPTY STATE ── */}
        {!activeConv ? (
          <EmptyState
            icon="💬"
            title="No conversation selected"
            sub="Choose a chat from the sidebar"
          />
        ) : (
          <>
            {/* Messages scroll area */}
            <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4">
              {loading ? (
                <Spinner />
              ) : messages.length === 0 ? (
                <EmptyState
                  icon="👋"
                  title="Say hello!"
                  sub="Be the first to send a message"
                />
              ) : (
                <>


                  {messages.map((msg, idx) => {
  const dateLabel = getDateLabel(msg, idx);

  const myId = extractId(currentUser?._id);
  const senderId = extractId(msg.senderId);

  // console.log("MY ID:", myId);
  // console.log("SENDER ID:", senderId);

  const isMine =
    myId && senderId && String(myId) === String(senderId);

  return (
    <MessageBubble
      key={msg._id}
      msg={msg}
      isMine={isMine}
      showDate={!!dateLabel}
      dateLabel={dateLabel}
    />
  );
})}

                  <AnimatePresence>
                    {otherTyping && <TypingIndicator />}
                  </AnimatePresence>
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT AREA ── */}
            {canSendMessage ? (
              <div className="relative z-10 px-5 py-4 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 flex-shrink-0">
                <div className="flex items-end gap-3">
                  <div className="flex-1 bg-slate-700 border border-slate-600 rounded-2xl focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-200">
                    <textarea
                      ref={textareaRef}
                      className="w-full bg-transparent border-none outline-none text-slate-100 text-sm placeholder-slate-500 px-4 py-3 resize-none max-h-[120px] leading-relaxed rounded-2xl"
                      placeholder="Type a message…"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      rows={1}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-opacity"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                  </motion.button>
                </div>
                <p className="text-[10px] text-slate-600 mt-2 text-center">
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            ) : (
              <div className="relative z-10 px-5 py-4 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-1">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  This appointment is completed — chat history is read-only
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
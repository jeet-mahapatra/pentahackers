
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { UserContext } from "../Context/UserContext";

const SOCKET_URL = "http://localhost:3000";
const API_URL    = "http://localhost:3000/api";

/* ─── Utilities ──────────────────────────────────────────────── */
const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (d) => {
  const date  = new Date(d);
  const today = new Date();
  const yest  = new Date(); yest.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yest.toDateString())  return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const extractId = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object") return String(val._id ?? val.id ?? val);
  return String(val);
};

const checkIsMine = (msg, currentUser) => {
  const myId  = extractId(currentUser?.id) ?? extractId(currentUser?._id);
  const sndId = extractId(msg.senderId);
  return myId && sndId && String(myId) === String(sndId);
};

/* ─── Magnetic cursor (matches landing) ──────────────────────── */
function MagneticCursor() {
  const x  = useMotionValue(-100);
  const y  = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });
  useEffect(() => {
    const move = (e) => { x.set(e.clientX - 8); y.set(e.clientY - 8); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <motion.div style={{
      position:"fixed", width:16, height:16, borderRadius:"50%",
      background:"rgba(45,212,191,0.7)", pointerEvents:"none", zIndex:9999,
      mixBlendMode:"screen", left:sx, top:sy,
      boxShadow:"0 0 20px rgba(45,212,191,0.6)",
    }} />
  );
}

/* ─── Aurora mesh (subtle, sidebar-only blob) ────────────────── */
function SidebarAurora() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      <motion.div
        animate={{ x:[0,30,-20,0], y:[0,-30,40,0], scale:[1,1.1,0.95,1] }}
        transition={{ duration:20, repeat:Infinity, ease:"easeInOut" }}
        style={{
          position:"absolute", width:400, height:400,
          background:"radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
          top:"-10%", left:"-20%", borderRadius:"50%", filter:"blur(50px)",
        }}
      />
      <motion.div
        animate={{ x:[0,-40,20,0], y:[0,50,-30,0], scale:[1,0.9,1.15,1] }}
        transition={{ duration:25, repeat:Infinity, ease:"easeInOut", delay:5 }}
        style={{
          position:"absolute", width:300, height:300,
          background:"radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
          bottom:"10%", right:"-10%", borderRadius:"50%", filter:"blur(60px)",
        }}
      />
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
const Avatar = ({ name, size = "md" }) => {
  const dim = { sm:32, md:40, lg:48 }[size];
  const fs  = { sm:12, md:14, lg:16 }[size];
  const letter = (name?.[0] ?? "?").toUpperCase();
  return (
    <div style={{
      width:dim, height:dim, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg, #2DD4BF, #F59E0B)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:fs, fontWeight:700, color:"#080C1C",
      boxShadow:"0 0 0 2px rgba(45,212,191,0.25)",
      fontFamily:"'Fraunces', serif",
    }}>
      {letter}
    </div>
  );
};

/* ─── Conversation item ──────────────────────────────────────── */
const ConversationItem = ({ conv, isActive, currentUserId, onSelect }) => {
  const myId  = extractId(currentUserId);
  const other = extractId(conv.serviceUser?._id) === myId
    ? conv.serviceProvider : conv.serviceUser;
  const preview = conv.lastMessage?.message ?? "No messages yet";

  return (
    <motion.button
      whileHover={{ x:3 }}
      whileTap={{ scale:0.97 }}
      onClick={() => onSelect(conv)}
      style={{
        width:"100%", textAlign:"left", background:"transparent",
        border:"none", padding:0, cursor:"none", display:"block",
        marginBottom:4,
      }}
    >
      <div style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"11px 14px", borderRadius:16, position:"relative",
        background: isActive
          ? "rgba(45,212,191,0.08)"
          : "rgba(255,255,255,0.02)",
        border:`1px solid ${isActive ? "rgba(45,212,191,0.25)" : "rgba(255,255,255,0.05)"}`,
        transition:"all 0.2s",
      }}>
        {isActive && (
          <motion.div
            layoutId="activeBar"
            style={{
              position:"absolute", left:0, top:"20%", bottom:"20%",
              width:3, borderRadius:"0 4px 4px 0",
              background:"linear-gradient(180deg,#2DD4BF,#F59E0B)",
            }}
          />
        )}
        <Avatar name={other?.username} size="md" />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            fontSize:13, fontWeight:600, color:"#fff",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
            fontFamily:"'Plus Jakarta Sans', sans-serif",
          }}>
            {other?.username ?? "Unknown"}
          </p>
          <p style={{
            fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
            fontFamily:"'Plus Jakarta Sans', sans-serif",
          }}>
            {preview.length > 36 ? preview.slice(0,36)+"…" : preview}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

/* ─── Typing indicator ───────────────────────────────────────── */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
    exit={{ opacity:0, y:8 }}
    style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}
  >
    <div style={{
      background:"rgba(45,212,191,0.06)", border:"1px solid rgba(45,212,191,0.15)",
      borderRadius:18, padding:"10px 16px", display:"flex", gap:5,
    }}>
      {[0,1,2].map(i => (
        <motion.div key={i}
          style={{ width:6, height:6, borderRadius:"50%", background:"rgba(45,212,191,0.7)" }}
          animate={{ y:[0,-5,0] }}
          transition={{ duration:0.9, repeat:Infinity, delay:i*0.18 }}
        />
      ))}
    </div>
    <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      typing…
    </span>
  </motion.div>
);

/* ─── Message bubble ─────────────────────────────────────────── */
const MessageBubble = ({ msg, isMine }) => (
  <motion.div
    initial={{ opacity:0, y:10, scale:0.97 }}
    animate={{ opacity:1, y:0, scale:1 }}
    transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}
    style={{
      display:"flex", justifyContent: isMine ? "flex-end" : "flex-start",
      marginBottom:6,
    }}
  >
    <div style={{
      maxWidth:"62%", padding:"10px 16px", borderRadius: isMine
        ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      background: isMine
        ? "linear-gradient(135deg,#2DD4BF,#0EA5E9)"
        : "rgba(255,255,255,0.04)",
      border: isMine ? "none" : "1px solid rgba(255,255,255,0.07)",
      boxShadow: isMine
        ? "0 8px 24px rgba(45,212,191,0.2)"
        : "0 4px 12px rgba(0,0,0,0.3)",
    }}>
      <p style={{
        fontSize:14, lineHeight:1.6,
        color: isMine ? "#080C1C" : "rgba(255,255,255,0.85)",
        fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0,
      }}>
        {msg.message}
      </p>
      <p style={{
        fontSize:11, marginTop:4, textAlign:"right",
        color: isMine ? "rgba(8,12,28,0.55)" : "rgba(255,255,255,0.25)",
        fontFamily:"'Plus Jakarta Sans',sans-serif",
      }}>
        {formatTime(msg.createdAt)}
      </p>
    </div>
  </motion.div>
);

/* ─── Date divider ───────────────────────────────────────────── */
const DateDivider = ({ label }) => (
  <div style={{
    display:"flex", alignItems:"center", gap:12,
    margin:"20px 0 12px",
  }}>
    <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
    <span style={{
      fontSize:11, color:"rgba(255,255,255,0.28)", fontWeight:600,
      letterSpacing:"0.06em", textTransform:"uppercase",
      fontFamily:"'Plus Jakarta Sans',sans-serif",
    }}>{label}</span>
    <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
  </div>
);

/* ─── Empty state ────────────────────────────────────────────── */
const EmptyState = ({ icon, title, sub }) => (
  <div style={{
    flex:1, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", gap:14,
    padding:"0 32px", textAlign:"center",
  }}>
    <motion.div
      animate={{ y:[0,-10,0] }}
      transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
      style={{
        width:72, height:72, borderRadius:"50%",
        background:"rgba(45,212,191,0.06)",
        border:"1px solid rgba(45,212,191,0.18)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:32, boxShadow:"0 0 40px rgba(45,212,191,0.1)",
      }}
    >
      {icon}
    </motion.div>
    <div>
      <p style={{ fontSize:15, fontWeight:600, color:"rgba(255,255,255,0.6)", fontFamily:"'Fraunces',serif" }}>{title}</p>
      <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", marginTop:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{sub}</p>
    </div>
  </div>
);

/* ─── Spinner ────────────────────────────────────────────────── */
const Spinner = () => (
  <div style={{ display:"flex", justifyContent:"center", padding:"40px 0" }}>
    <div style={{
      width:32, height:32, borderRadius:"50%",
      border:"2px solid rgba(255,255,255,0.06)",
      borderTop:"2px solid #2DD4BF",
      animation:"spin 0.8s linear infinite",
    }} />
  </div>
);

/* ─── Shimmer line (matches landing) ─────────────────────────── */
const ShimmerLine = ({ pos = "top" }) => (
  <div style={{
    position:"absolute", [pos]:0, left:0, right:0, height:1,
    background:"linear-gradient(90deg,transparent,rgba(45,212,191,0.6),rgba(245,158,11,0.6),transparent)",
    backgroundSize:"200% 100%",
    animation:"shimmer 3s linear infinite",
  }} />
);

/* ─── Main ChatPage ──────────────────────────────────────────── */
export default function ChatPage() {
  const { user: currentUser, loading: userLoading } = useContext(UserContext);

  const [conversations,  setConversations]  = useState([]);
  const [activeConv,     setActiveConv]     = useState(null);
  const [messages,       setMessages]       = useState([]);
  const [input,          setInput]          = useState("");
  const [isTyping,       setIsTyping]       = useState(false);
  const [otherTyping,    setOtherTyping]    = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [accessError,    setAccessError]    = useState(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(true);

  const socketRef     = useRef(null);
  const messagesEndRef= useRef(null);
  const typingTimeout = useRef(null);
  const textareaRef   = useRef(null);

  /* auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, []);
  useEffect(scrollToBottom, [messages, otherTyping]);

  /* socket */
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials:true });
    socketRef.current = socket;

    socket.on("receive_message", (msg) => {
      setMessages(prev => prev.find(m => m._id === msg._id) ? prev : [...prev, msg]);
      setConversations(prev => prev.map(c => {
        const ids = c.allAppointmentIds?.map(String) ?? [String(c.appointmentId)];
        return ids.includes(String(msg.appointmentId)) ? { ...c, lastMessage:msg } : c;
      }));
    });
    socket.on("user_typing",      () => setOtherTyping(true));
    socket.on("user_stop_typing", () => setOtherTyping(false));
    socket.on("error",  (e) => setAccessError(e.message));

    return () => socket.disconnect();
  }, []);

  /* load conversations */
  useEffect(() => {
    axios.get(`${API_URL}/chat/conversations`, { withCredentials:true })
      .then(({ data }) => { if (data.success) setConversations(data.conversations); })
      .catch(console.error);
  }, []);

  /* select conversation */
  const handleSelectConv = async (conv) => {
    setAccessError(null); setMessages([]); setActiveConv(conv);
    if (window.innerWidth < 768) setSidebarOpen(false);

    const allIds   = conv.allAppointmentIds?.map(String) ?? [conv.appointmentId];
    const primary  = String(conv.appointmentId);

    try {
      const ar = await axios.get(`${API_URL}/chat/access/${primary}`, { withCredentials:true });
      setCanSendMessage(ar.data.canSendMessage !== false);

      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/chat/history/${primary}?all=${allIds.join(",")}`,
        { withCredentials:true }
      );
      if (data.success) setMessages(data.messages);
      setLoading(false);

      allIds.forEach(id => socketRef.current?.emit("join_room", { appointmentId:id }));
      setConversations(prev =>
        prev.map(c => c.appointmentId === conv.appointmentId ? { ...c, unreadCount:0 } : c)
      );
      setTimeout(() => textareaRef.current?.focus(), 100);
    } catch (err) {
      setLoading(false);
      setAccessError(err.response?.data?.message ?? "Unable to access this chat");
    }
  };

  /* send */
  const handleSend = () => {
    const t = input.trim();
    if (!t || !activeConv) return;
    socketRef.current?.emit("send_message", { appointmentId:activeConv.appointmentId, message:t });
    setInput("");
    clearTimeout(typingTimeout.current);
    socketRef.current?.emit("stop_typing", { appointmentId:activeConv.appointmentId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!activeConv) return;
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current?.emit("typing", { appointmentId:activeConv.appointmentId });
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit("stop_typing", { appointmentId:activeConv.appointmentId });
    }, 1500);
  };

  const getOtherName = (conv) => {
    if (!conv) return "";
    const myId = extractId(currentUser?._id) ?? extractId(currentUser?.id);
    const other = extractId(conv.serviceUser?._id) === myId
      ? conv.serviceProvider : conv.serviceUser;
    return other?.username ?? "Unknown";
  };

  /* date grouping */
  const getDateLabel = (msg, idx) => {
    if (idx === 0) return formatDate(msg.createdAt);
    const prev = messages[idx - 1];
    return new Date(prev.createdAt).toDateString() !== new Date(msg.createdAt).toDateString()
      ? formatDate(msg.createdAt) : null;
  };

  if (userLoading || !currentUser) return null;

  /* ── render ───────────────────────────────────────────────── */
  return (
    <div style={{
      display:"flex", height:"100vh", width:"100%",
      background:"#080C1C", color:"#fff", overflow:"hidden",
      fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",
      cursor:"none",
    }}>

      <MagneticCursor />

      {/* global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:rgba(45,212,191,0.3); }
        body { cursor:none; }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0%  { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        textarea::-webkit-scrollbar { width:4px; }
        textarea::-webkit-scrollbar-track { background:transparent; }
        textarea::-webkit-scrollbar-thumb { background:rgba(45,212,191,0.3); border-radius:4px; }
        .msg-scroll::-webkit-scrollbar { width:4px; }
        .msg-scroll::-webkit-scrollbar-track { background:transparent; }
        .msg-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
        .conv-scroll::-webkit-scrollbar { width:4px; }
        .conv-scroll::-webkit-scrollbar-track { background:transparent; }
        .conv-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:4px; }
        .send-btn { cursor:none !important; }
        .send-btn:disabled { opacity:0.35; }
      `}</style>

      {/* ── MOBILE OVERLAY ─────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              display:"none",
              position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:20,
              // shown via media query below
            }}
            className="mobile-overlay"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside style={{
        width:300, flexShrink:0, display:"flex", flexDirection:"column",
        background:"rgba(8,12,28,0.97)",
        borderRight:"1px solid rgba(255,255,255,0.06)",
        position:"relative", overflow:"hidden",
        zIndex:30,
        // mobile: absolute + translate
        transition:"transform 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
        className={`chat-sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <SidebarAurora />
        <ShimmerLine pos="bottom" />

        {/* Sidebar header */}
        <div style={{
          padding:"22px 20px 18px", position:"relative", zIndex:1,
          borderBottom:"1px solid rgba(255,255,255,0.05)",
          flexShrink:0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <motion.div
              whileHover={{ rotate:15, scale:1.1 }}
              transition={{ type:"spring", stiffness:300 }}
              style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                background:"linear-gradient(135deg,#2DD4BF,#F59E0B)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, color:"#080C1C", fontWeight:800,
              }}
            >💬</motion.div>
            <div>
              <h2 style={{
                fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:800,
                letterSpacing:"-0.5px",
              }}>Messages</h2>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>
                Accepted appointments
              </p>
            </div>
          </div>
        </div>

        {/* Conversation list */}
        <div className="conv-scroll" style={{
          flex:1, overflowY:"auto", padding:"12px 12px", position:"relative", zIndex:1,
        }}>
          {conversations.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 16px" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>✦</div>
              <p style={{
                fontSize:12, color:"rgba(255,255,255,0.25)", lineHeight:1.8,
                fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>
                No active chats yet.<br />
                Chat unlocks when a provider accepts your appointment.
              </p>
            </div>
          ) : conversations.map(conv => (
            <ConversationItem
              key={conv.appointmentId}
              conv={conv}
              isActive={activeConv?.appointmentId === conv.appointmentId}
              currentUserId={extractId(currentUser?._id) ?? extractId(currentUser?.id)}
              onSelect={handleSelectConv}
            />
          ))}
        </div>

        {/* Current user badge */}
        <div style={{
          padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,0.05)",
          display:"flex", alignItems:"center", gap:10,
          position:"relative", zIndex:1, flexShrink:0,
        }}>
          <Avatar name={currentUser?.username ?? currentUser?.name} size="sm" />
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {currentUser?.username ?? currentUser?.name ?? "Me"}
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#2DD4BF", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:10, color:"#2DD4BF", fontWeight:600 }}>Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT ──────────────────────────────────────────── */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, position:"relative", overflow:"hidden" }}>

        {/* Grid background */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          backgroundImage:`
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize:"50px 50px",
        }} />
        {/* Ambient glow */}
        <div style={{
          position:"absolute", width:500, height:500,
          background:"radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)",
          top:"30%", right:"10%", borderRadius:"50%", filter:"blur(80px)", pointerEvents:"none", zIndex:0,
        }} />

        {/* ── HEADER ───────────────────────────────────────────── */}
        <div style={{
          display:"flex", alignItems:"center", gap:14,
          padding:"14px 24px",
          background:"rgba(8,12,28,0.9)", backdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(255,255,255,0.05)",
          flexShrink:0, position:"relative", zIndex:10,
        }}>
          <ShimmerLine pos="bottom" />

          {/* Mobile hamburger */}
          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
            onClick={() => setSidebarOpen(v => !v)}
            className="mobile-hamburger"
            style={{
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10, padding:"8px 10px", cursor:"none", color:"rgba(255,255,255,0.6)",
              display:"none", flexShrink:0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </motion.button>

          {activeConv ? (
            <>
              <div style={{ position:"relative", flexShrink:0 }}>
                <Avatar name={getOtherName(activeConv)} size="md" />
                <div style={{
                  position:"absolute", bottom:0, right:0, width:10, height:10,
                  borderRadius:"50%", background:"#2DD4BF",
                  border:"2px solid #080C1C", animation:"pulse 2s infinite",
                }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{
                  fontSize:15, fontWeight:700, fontFamily:"'Fraunces',serif",
                  letterSpacing:"-0.3px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                }}>
                  {getOtherName(activeConv)}
                </p>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  {activeConv.requestType}
                </p>
              </div>

              {/* Header actions */}
              <div style={{ display:"flex", gap:8 }}>
                {["◎","⬡"].map((icon,i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                    style={{
                      width:36, height:36, borderRadius:10, cursor:"none",
                      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                      color:"rgba(255,255,255,0.4)", fontSize:15,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color="#2DD4BF"; e.currentTarget.style.borderColor="rgba(45,212,191,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
                  >{icon}</motion.button>
                ))}
              </div>
            </>
          ) : (
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.3)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Select a conversation to begin
            </p>
          )}
        </div>

        {/* ── ERROR BANNER ─────────────────────────────────────── */}
        <AnimatePresence>
          {accessError && (
            <motion.div
              initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
              style={{
                position:"relative", zIndex:10, margin:"12px 20px 0",
                background:"rgba(251,113,133,0.08)", border:"1px solid rgba(251,113,133,0.25)",
                borderRadius:14, padding:"12px 18px",
                fontSize:13, color:"#FDA4AF", fontFamily:"'Plus Jakarta Sans',sans-serif",
                display:"flex", alignItems:"center", gap:8,
              }}
            >
              <span>⚠</span> {accessError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MESSAGES ─────────────────────────────────────────── */}
        {!activeConv ? (
          <EmptyState
            icon="✦"
            title="No conversation selected"
            sub="Choose a chat from the sidebar to start messaging"
          />
        ) : (
          <>
            <div className="msg-scroll" style={{
              flex:1, overflowY:"auto", padding:"20px 24px",
              position:"relative", zIndex:5,
            }}>
              {loading ? <Spinner /> : messages.length === 0 ? (
                <EmptyState icon="👋" title="Say hello!" sub="Be the first to send a message" />
              ) : (
                <>
                  {messages.map((msg, idx) => {
                    const dateLabel = getDateLabel(msg, idx);
                    const myId  = extractId(currentUser?._id) ?? extractId(currentUser?.id);
                    const sndId = extractId(msg.senderId);
                    const isMine = myId && sndId && String(myId) === String(sndId);
                    return (
                      <div key={msg._id}>
                        {dateLabel && <DateDivider label={dateLabel} />}
                        <MessageBubble msg={msg} isMine={isMine} />
                      </div>
                    );
                  })}
                  <AnimatePresence>
                    {otherTyping && <TypingIndicator />}
                  </AnimatePresence>
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT ──────────────────────────────────────────── */}
            {canSendMessage ? (
              <div style={{
                padding:"16px 20px",
                background:"rgba(8,12,28,0.95)", backdropFilter:"blur(24px)",
                borderTop:"1px solid rgba(255,255,255,0.05)",
                flexShrink:0, position:"relative", zIndex:10,
              }}>
                <ShimmerLine pos="top" />
                <div style={{ display:"flex", alignItems:"flex-end", gap:12 }}>
                  <div style={{
                    flex:1,
                    background:"rgba(255,255,255,0.03)", borderRadius:18,
                    border:"1px solid rgba(255,255,255,0.08)",
                    transition:"border-color 0.2s, box-shadow 0.2s",
                    padding:"4px 6px 4px 18px",
                    display:"flex", alignItems:"flex-end",
                  }}
                    onFocusCapture={e => {
                      e.currentTarget.style.borderColor="rgba(45,212,191,0.4)";
                      e.currentTarget.style.boxShadow="0 0 0 3px rgba(45,212,191,0.08)";
                    }}
                    onBlurCapture={e => {
                      e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow="none";
                    }}
                  >
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      rows={1}
                      style={{
                        flex:1, background:"transparent", border:"none", outline:"none",
                        color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:1.6,
                        fontFamily:"'Plus Jakarta Sans',sans-serif",
                        padding:"11px 0", resize:"none", maxHeight:120,
                        caretColor:"#2DD4BF",
                      }}
                    />
                  </div>

                  {/* Emoji btn placeholder */}
                  <motion.button
                    whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                    style={{
                      width:44, height:44, borderRadius:14, cursor:"none",
                      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, flexShrink:0,
                    }}
                  >😊</motion.button>

                  {/* Send button */}
                  <motion.button
                    className="send-btn"
                    whileHover={{ scale:1.08, boxShadow:"0 16px 40px rgba(45,212,191,0.4)" }}
                    whileTap={{ scale:0.92 }}
                    onClick={handleSend}
                    disabled={!input.trim()}
                    style={{
                      width:44, height:44, borderRadius:14, cursor:"none", border:"none",
                      background:"linear-gradient(135deg,#2DD4BF,#0EA5E9)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0,
                      boxShadow:"0 8px 24px rgba(45,212,191,0.3)",
                      transition:"box-shadow 0.2s",
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M2 8.5L15.5 2L9 15.5L7.5 10L2 8.5Z" fill="#080C1C" strokeWidth="0"/>
                    </svg>
                  </motion.button>
                </div>
                <p style={{
                  fontSize:11, color:"rgba(255,255,255,0.2)", marginTop:8, textAlign:"center",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                }}>
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            ) : (
              <div style={{
                padding:"16px 24px",
                background:"rgba(8,12,28,0.95)", backdropFilter:"blur(24px)",
                borderTop:"1px solid rgba(255,255,255,0.05)",
                flexShrink:0, position:"relative", zIndex:10,
              }}>
                <ShimmerLine pos="top" />
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"center",
                  gap:8, padding:"10px 0",
                  background:"rgba(255,255,255,0.02)", borderRadius:14,
                  border:"1px solid rgba(255,255,255,0.06)",
                }}>
                  <span style={{ fontSize:14 }}>🔒</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    This appointment is completed — chat history is read-only
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Responsive styles */}
      <style>{`
        .chat-sidebar {
          position: relative;
        }
        @media (max-width: 767px) {
          .chat-sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            z-index: 30;
          }
          .sidebar-closed {
            transform: translateX(-100%) !important;
          }
          .sidebar-open {
            transform: translateX(0) !important;
          }
          .mobile-overlay {
            display: block !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-hamburger {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
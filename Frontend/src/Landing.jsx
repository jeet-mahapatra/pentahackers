import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Static data ─────────────────────────────────────── */
const features = [
  {
    icon: "✦",
    title: "Smart Search",
    desc: "AI-matched professionals based on your exact needs, location, and budget.",
    accent: "#2DD4BF",
    glow: "rgba(45,212,191,0.15)",
    tag: "Discovery",
  },
  {
    icon: "◈",
    title: "Instant Booking",
    desc: "Real-time availability slots. Confirm a booking in under 30 seconds.",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.15)",
    tag: "Booking",
  },
  {
    icon: "◎",
    title: "Live Chat",
    desc: "End-to-end encrypted messaging directly with your service provider.",
    accent: "#34D399",
    glow: "rgba(52,211,153,0.15)",
    tag: "Communication",
  },
  {
    icon: "⬡",
    title: "Verified Pros",
    desc: "Every provider is background-checked, rated, and reviewed by real users.",
    accent: "#FB923C",
    glow: "rgba(251,146,60,0.15)",
    tag: "Trust",
  },
];

const stats = [
  { value: "50K+", label: "Professionals" },
  { value: "200K+", label: "Bookings Made" },
  { value: "4.9★", label: "Average Rating" },
  { value: "120+", label: "Service Types" },
];

/* ─── Animated counter ───────────────────────────────── */
function Counter({ target }) {
  const [count, setCount] = useState(0);
  const isNumeric = /^\d+/.test(target);
  const num = isNumeric ? parseInt(target) : 0;
  const suffix = target.replace(/^[\d,]+/, "");

  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const end = num;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return <>{isNumeric ? count.toLocaleString() + suffix : target}</>;
}

/* ─── Aurora mesh background ─────────────────────────── */
function AuroraMesh() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {/* Blob 1 — teal */}
      <motion.div
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 60, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(45,212,191,0.22) 0%, transparent 70%)",
          top: "-15%", left: "-10%", borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      {/* Blob 2 — amber */}
      <motion.div
        animate={{ x: [0, -80, 40, 0], y: [0, 60, -50, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)",
          top: "10%", right: "-8%", borderRadius: "50%",
          filter: "blur(70px)",
        }}
      />
      {/* Blob 3 — emerald */}
      <motion.div
        animate={{ x: [0, 50, -60, 0], y: [0, 80, 20, 0], scale: [1, 1.1, 0.85, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        style={{
          position: "absolute", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
          bottom: "5%", left: "25%", borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}

/* ─── Magnetic cursor dot ────────────────────────────── */
function MagneticCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX - 8); y.set(e.clientY - 8); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed", width: 16, height: 16,
        borderRadius: "50%",
        background: "rgba(45,212,191,0.7)",
        pointerEvents: "none", zIndex: 9999,
        mixBlendMode: "screen",
        left: sx, top: sy,
        boxShadow: "0 0 20px rgba(45,212,191,0.6)",
      }}
    />
  );
}

/* ─── Floating badge ─────────────────────────────────── */
function FloatingBadge({ style, text, sub, delay = 0, emoji }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        background: "rgba(8,12,28,0.82)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(45,212,191,0.2)",
        borderRadius: "16px",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
        ...style,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "10px",
        background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, flexShrink: 0,
      }}>
        {emoji}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{text}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sub}</div>
      </div>
    </motion.div>
  );
}

/* ─── Typewriter effect ──────────────────────────────── */
function Typewriter({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    } else if (!deleting && displayed.length === word.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((wordIdx + 1) % words.length);
    }
  }, [displayed, deleting, wordIdx, words]);

  return (
    <span style={{
      background: "linear-gradient(135deg, #2DD4BF 0%, #F59E0B 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        style={{ WebkitTextFillColor: "#2DD4BF", color: "#2DD4BF" }}
      >|</motion.span>
    </span>
  );
}

/* ─── Main Landing component ──────────────────────────── */
const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C1C",
      color: "#fff",
      fontFamily: "'Cabinet Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif",
      overflowX: "hidden",
    }}>
      <MagneticCursor />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(45,212,191,0.3); }
        a { text-decoration: none; color: inherit; }
        body { cursor: none; }

        .nav-link {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          padding: 7px 16px;
          border-radius: 24px;
          transition: all 0.25s;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px;
          background: linear-gradient(135deg, #2DD4BF, #0EA5E9);
          border-radius: 12px;
          font-size: 15px; font-weight: 600; color: #080C1C;
          cursor: none; border: none;
          transition: transform 0.25s, box-shadow 0.25s;
          letter-spacing: -0.01em;
          position: relative; overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(45,212,191,0.4), 0 0 0 1px rgba(45,212,191,0.3);
        }
        .btn-primary:hover::after { opacity: 1; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
          font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8);
          cursor: none;
          transition: all 0.25s;
          letter-spacing: -0.01em;
          backdrop-filter: blur(8px);
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-2px);
          color: #fff;
        }

        .feature-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          padding: 30px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
          cursor: none;
        }
        .feature-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(500px circle at var(--mx,50%) var(--my,50%), var(--glow,rgba(45,212,191,0.1)), transparent 55%);
          opacity: 0; transition: opacity 0.4s;
        }
        .feature-card:hover {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }
        .feature-card:hover::before { opacity: 1; }

        .stat-card {
          text-align: center;
          padding: 28px 20px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .stat-card:hover {
          border-color: rgba(45,212,191,0.3);
          transform: translateY(-3px);
        }

        .step-card {
          padding: 34px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          position: relative;
          overflow: hidden;
          transition: all 0.35s;
        }
        .step-card:hover {
          border-color: rgba(45,212,191,0.25);
          background: rgba(255,255,255,0.04);
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }

        @keyframes scrollBounce {
          0%,100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50% { transform: translateX(-50%) translateY(8px); opacity: 0.4; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .shimmer-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(45,212,191,0.6), rgba(245,158,11,0.6), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: 68,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 36px",
          background: "rgba(8,12,28,0.75)",
          backdropFilter: "blur(28px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          zIndex: 100,
        }}
      >
        <div className="shimmer-line" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />

        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, color: "#080C1C", fontWeight: 800,
            }}
          >✦</motion.div>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 19, fontWeight: 800, letterSpacing: "-0.5px",
          }}>
            Service<span style={{ color: "#2DD4BF" }}>Hub</span>
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/login">
            <button className="btn-ghost" style={{ padding: "8px 18px", fontSize: 14 }}>
              Sign In
            </button>
          </Link>
          <Link to="/register/user">
            <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
              Get Started →
            </button>
          </Link>
        </div>
      </motion.header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px 36px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AuroraMesh />

        <div style={{
          maxWidth: 1160, margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 70, alignItems: "center", position: "relative", zIndex: 2,
        }}>
          {/* Left: Copy */}
          <motion.div style={{ y: heroY }}>
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(45,212,191,0.08)",
                border: "1px solid rgba(45,212,191,0.2)",
                borderRadius: 24, padding: "6px 14px 6px 8px",
                marginBottom: 26,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
                  borderRadius: 20, padding: "3px 10px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                  color: "#080C1C", textTransform: "uppercase",
                }}
              >New</motion.span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                AI-powered professional matching
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(40px, 5.5vw, 66px)",
                fontWeight: 900,
                lineHeight: 1.07,
                letterSpacing: "-2.5px",
                marginBottom: 24,
              }}
            >
              Book Trusted
              <br />
              <Typewriter words={["Plumbers", "Designers", "Tutors", "Cleaners", "Coaches"]} />
              <br />
              <span style={{ color: "rgba(255,255,255,0.9)", fontStyle: "italic" }}>
                Instantly.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.7 }}
              style={{
                fontSize: 17, color: "rgba(255,255,255,0.45)",
                lineHeight: 1.75, marginBottom: 38, maxWidth: 440,
                fontWeight: 400,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Connect with verified professionals in your city. Smart matching,
              zero friction, real results — from first search to final handshake.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link to="/register/user">
                <button className="btn-primary">
                  Join as User
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Link>
              <Link to="/register/provider">
                <button className="btn-ghost">Become a Provider</button>
              </Link>
            </motion.div>

            {/* Trusted by */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 38 }}
            >
              <div style={{ display: "flex" }}>
                {["#2DD4BF", "#F59E0B", "#34D399", "#FB923C", "#0EA5E9"].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: c, border: "2.5px solid #080C1C",
                      marginLeft: i === 0 ? 0 : -9,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: "#080C1C",
                    }}
                  >
                    {["A", "B", "C", "D", "E"][i]}
                  </motion.div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Trusted by <strong style={{ color: "rgba(255,255,255,0.75)" }}>50,000+</strong> users
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard card */}
          <div style={{ position: "relative", height: 500 }}>
            {/* Main dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute", top: 30, right: 0, left: 30,
                background: "rgba(8,12,28,0.85)",
                border: "1px solid rgba(45,212,191,0.18)",
                borderRadius: 24, padding: 28,
                backdropFilter: "blur(28px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>Total bookings</div>
                  <div style={{ fontSize: 34, fontFamily: "'Fraunces',serif", fontWeight: 800, letterSpacing: "-1px" }}>2,847</div>
                  <div style={{ fontSize: 12, color: "#2DD4BF", marginTop: 3, fontWeight: 600 }}>↑ 23.4% vs last year</div>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #2DD4BF, #0EA5E9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "#080C1C",
                  boxShadow: "0 8px 24px rgba(45,212,191,0.35)",
                }}>◈</div>
              </div>

              {/* Bar chart */}
              <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 72, marginBottom: 14 }}>
                {[38, 60, 42, 75, 52, 85, 65, 92, 58, 78, 70, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.65 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      flex: 1, height: `${h}%`,
                      background: i === 11
                        ? "linear-gradient(to top, #2DD4BF, #0EA5E9)"
                        : i >= 9
                          ? `rgba(45,212,191,${0.15 + (i - 9) * 0.1})`
                          : "rgba(255,255,255,0.07)",
                      borderRadius: 5,
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jan → Dec 2024</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#2DD4BF", "#F59E0B", "#34D399"].map((c, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, marginTop: 3 }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating badges */}
            <FloatingBadge
              delay={0.9}
              emoji="🏠"
              text="Sarah M. booked"
              sub="Home Cleaning · 2 min ago"
              style={{ bottom: 90, left: -20, width: 240 }}
            />
            <FloatingBadge
              delay={1.15}
              emoji="⭐"
              text="5.0 — Excellent!"
              sub="Plumbing service review"
              style={{ top: 10, right: -15, width: 215 }}
            />

            {/* Floating illustration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ position: "absolute", bottom: -5, right: 20 }}
            >
              <motion.img
                src="https://www.naapbooks.com/media/rogk5fqo/qcxlxzyt.png?width=400"
                style={{
                  width: 200,
                  filter: "drop-shadow(0 20px 50px rgba(45,212,191,0.2)) saturate(1.2)",
                }}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: "absolute", bottom: 32, left: "50%",
            animation: "scrollBounce 2.2s infinite",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,0.25)", fontSize: 12,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div style={{ fontSize: 18 }}>↓</div>
          Scroll to explore
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          padding: "56px 36px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.015)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Shimmer top */}
        <div className="shimmer-line" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 36, fontWeight: 900,
                background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", letterSpacing: "-1px",
              }}>
                <Counter target={s.value} />
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: "110px 36px", maxWidth: 1160, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <p style={{
            fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#2DD4BF", fontWeight: 700, marginBottom: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>Why ServiceHub</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,46px)",
            fontWeight: 900, letterSpacing: "-2px",
          }}>
            Everything you need,{" "}
            <span style={{
              background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", fontStyle: "italic",
            }}>nothing you don't</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              style={{ "--glow": f.glow }}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
                e.currentTarget.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
              }}
            >
              <span style={{
                display: "inline-block",
                fontSize: 11, fontWeight: 700,
                color: f.accent, background: f.accent + "18",
                borderRadius: 6, padding: "3px 10px",
                letterSpacing: "0.06em", textTransform: "uppercase",
                marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>{f.tag}</span>

              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: f.accent + "18",
                border: `1px solid ${f.accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 20, color: f.accent,
                boxShadow: `0 8px 24px ${f.accent}25`,
              }}>
                {f.icon}
              </div>

              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 19, fontWeight: 700,
                letterSpacing: "-0.5px", marginBottom: 10,
              }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        id="how"
        style={{
          padding: "110px 36px",
          background: "rgba(255,255,255,0.012)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* BG accent */}
        <div style={{
          position: "absolute", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          pointerEvents: "none", filter: "blur(60px)",
        }} />

        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 70 }}
          >
            <p style={{
              fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#F59E0B", fontWeight: 700, marginBottom: 14,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Simple Process</p>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,4vw,46px)",
              fontWeight: 900, letterSpacing: "-2px",
            }}>
              Up and running in{" "}
              <span style={{
                background: "linear-gradient(135deg, #F59E0B, #2DD4BF)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", fontStyle: "italic",
              }}>3 steps</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { n: "01", title: "Create your account", desc: "Sign up as a user or a service provider in under 2 minutes.", color: "#2DD4BF" },
              { n: "02", title: "Find or list services", desc: "Browse thousands of verified professionals, or list your own expertise.", color: "#F59E0B" },
              { n: "03", title: "Book & get it done", desc: "Confirm instantly, chat live, and pay securely — all in one place.", color: "#34D399" },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="step-card"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
              >
                {/* Step number watermark */}
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 72, fontWeight: 900,
                  color: step.color + "18",
                  lineHeight: 1, marginBottom: 16,
                  letterSpacing: "-4px",
                }}>{step.n}</div>

                {/* Colored top accent line */}
                <div style={{
                  height: 3, width: 40, borderRadius: 2,
                  background: `linear-gradient(90deg, ${step.color}, transparent)`,
                  marginBottom: 18,
                }} />

                <h3 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 20, fontWeight: 700, marginBottom: 10,
                  letterSpacing: "-0.5px",
                }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {step.desc}
                </p>

                {i < 2 && (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    style={{
                      position: "absolute", right: -14, top: "50%",
                      transform: "translateY(-50%)",
                      width: 28, height: 28, borderRadius: "50%",
                      background: step.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: "#080C1C", fontWeight: 700, zIndex: 2,
                      boxShadow: `0 4px 16px ${step.color}50`,
                    }}
                  >→</motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section style={{ padding: "110px 36px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background: "rgba(8,12,28,0.9)",
              border: "1px solid rgba(45,212,191,0.2)",
              borderRadius: 30,
              padding: "70px 56px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          >
            {/* Animated corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 200, height: 200, background: "radial-gradient(circle at top left, rgba(45,212,191,0.15), transparent 60%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle at bottom right, rgba(245,158,11,0.15), transparent 60%)", pointerEvents: "none" }} />

            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", top: -60, right: -60,
                width: 180, height: 180,
                border: "1px solid rgba(45,212,191,0.1)",
                borderRadius: "50%", pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", bottom: -80, left: -80,
                width: 240, height: 240,
                border: "1px solid rgba(245,158,11,0.08)",
                borderRadius: "50%", pointerEvents: "none",
              }}
            />

            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(28px,4vw,46px)",
              fontWeight: 900, letterSpacing: "-2px",
              marginBottom: 18, position: "relative",
            }}>
              Ready to get started?
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.4)",
              marginBottom: 40, maxWidth: 440, margin: "0 auto 40px",
              lineHeight: 1.75, position: "relative",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Join thousands of users and providers building better service experiences on ServiceHub.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link to="/register/user">
                <button className="btn-primary">Join as User →</button>
              </Link>
              <Link to="/register/provider">
                <button className="btn-ghost">Become a Provider</button>
              </Link>
              <Link to="/admin/login">
                <button className="btn-ghost">Admin Access</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        padding: "32px 36px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 16,
        position: "relative",
      }}>
        <div className="shimmer-line" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "#080C1C",
          }}>✦</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16 }}>
            Service<span style={{ color: "#2DD4BF" }}>Hub</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          © {new Date().getFullYear()} ServiceHub. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 22 }}>
          {["Privacy", "Terms", "Support"].map(l => (
            <a key={l} href="#"
              style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", transition: "color 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              onMouseEnter={e => e.target.style.color = "#2DD4BF"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export { Landing };
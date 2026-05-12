import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../Context/UserContext"; // ← adjust path to match your project

// ─── helpers ────────────────────────────────────────────────────────────────

const formatAddress = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  return [addr.street, addr.city, addr.pincode].filter(Boolean).join(", ");
};

const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:3000/${path.replace(/^\/+/, '')}`;
};

const initForm = (data) => ({
  // provider specific
  serviceType: data.serviceType || "",
  street:      data.address?.street  || "",
  city:        data.address?.city    || "",
  pincode:     data.address?.pincode || "",
  timeSlots:   data.timeSlots?.join(", ") || "",
  phone:       data.phone || data.phoneNumber || "",
  experience:  data.experience || "",
  // user specific
  address:     (typeof data.address === "string" ? data.address : "") || "",
  state:       data.state    || "",
  country:     data.country  || "",
  pinCode:     data.pinCode  || "",
  // shared
  fullName:    data.fullName    || "",
  phoneNumber: data.phoneNumber || data.phone || "",
  bio:         data.bio         || "",
});

// ─── tiny UI atoms ───────────────────────────────────────────────────────────

const Field = ({ label, value, accent, mono }) => (
  <div style={{
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 12, padding: "12px 16px",
    transition: "background 0.2s ease",
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
  >
    <p style={{
      fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 6px",
      textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700,
    }}>{label}</p>
    <p style={{
      fontSize: 14, fontWeight: 600, margin: 0,
      color: accent || "rgba(255,255,255,0.85)",
      fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
      wordBreak: "break-word",
    }}>{value || <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>—</span>}</p>
  </div>
);

const SectionCard = ({ title, icon, accentColor = "#2DD4BF", children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    style={{
      background: "rgba(10, 14, 28, 0.6)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20, padding: "24px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
    }}
  >
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)`,
    }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        boxShadow: `0 0 12px ${accentColor}20`
      }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 800,
        letterSpacing: "-0.3px", margin: 0, color: "#fff",
      }}>{title}</h3>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
  </motion.div>
);

const StatusBadge = ({ value, map }) => {
  const cfg = map[value] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)", icon: "●" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: "4px 12px",
      fontSize: 12, fontWeight: 700, color: cfg.color,
      textTransform: "capitalize", letterSpacing: "0.02em"
    }}>{cfg.icon} {value?.replace(/_/g, " ")}</span>
  );
};

// ─── badge config ────────────────────────────────────────────────────────────

const verificationMap = {
  pending:               { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  icon: "⏳" },
  approved:              { color: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)",  icon: "✓"  },
  rejected:              { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", icon: "✕"  },
  suspended:             { color: "#FB923C", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)",  icon: "⚠"  },
  schedule_for_deletion: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)", icon: "🗑" },
};

const statusMap = {
  active:    { color: "#34D399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)",  icon: "●" },
  suspended: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", icon: "⊘" },
};

const roleMap = {
  user:              { color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.25)", icon: "◎" },
  admin:             { color: "#e879f9", bg: "rgba(232,121,249,0.1)", border: "rgba(232,121,249,0.25)", icon: "★" },
  pending_provider:  { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  icon: "⬡" },
  approved_provider: { color: "#2DD4BF", bg: "rgba(45,212,191,0.1)",  border: "rgba(45,212,191,0.25)",  icon: "✦" },
};

const TABS = ["Overview", "Edit Profile"];

// ─── main component ──────────────────────────────────────────────────────────

export const ProviderProfile = () => {
  const { user, setUser, loading } = useContext(UserContext);

  const [activeTab, setActiveTab]   = useState("Overview");
  const [form, setForm]             = useState({});
  const [idProof, setIdProof]       = useState(null);
  const [photoproof, setPhotoproof] = useState(null);
  const [certification, setCertification] = useState(null);
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState("");

  // Initialize form when user data is available
  useEffect(() => {
    if (user) setForm(initForm(user));
  }, [user]);

  // Robust check for provider account
  const isProvider = user?.accountType === "provider" || user?.role?.includes("provider");
  const displayName = user?.fullName || user?.username;
  const initials    = user?.username?.charAt(0)?.toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "—";
  const lastUpdated = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    const fd = new FormData();

    if (isProvider) {
      fd.append("serviceType", form.serviceType);
      fd.append("address", JSON.stringify({ street: form.street, city: form.city, pincode: form.pincode }));
      fd.append("timeSlots", JSON.stringify(form.timeSlots.split(",").map((s) => s.trim()).filter(Boolean)));
      fd.append("phone",      form.phone);
      fd.append("experience", form.experience);
      fd.append("bio",        form.bio);
      
      // Append files if they were selected
      if (idProof)       fd.append("idProof", idProof);
      if (photoproof)    fd.append("photoproof", photoproof);
      if (certification) fd.append("certification", certification);
    } else {
      fd.append("fullName",    form.fullName);
      fd.append("phoneNumber", form.phoneNumber);
      fd.append("bio",         form.bio);
      fd.append("address",     form.address);
      fd.append("state",       form.state);
      fd.append("country",     form.country);
      fd.append("pinCode",     form.pinCode);
    }

    try {
      const endpoint = isProvider
        ? "/api/providerProfile/update"
        : "/api/userProfile/update";

      const res     = await axios.put(endpoint, fd);
      const updated = res.data.provider || res.data.user || res.data;

      setUser((prev) => ({ ...prev, ...updated }));
      
      // Clear file states so the input resets
      setIdProof(null);
      setPhotoproof(null);
      setCertification(null);
      
      setActiveTab("Overview");
    } catch (err) {
      setSaveError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#060A18",
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        style={{
          width: 36, height: 36,
          border: "2px solid rgba(255,255,255,0.06)",
          borderTop: "2px solid #2DD4BF",
          borderRadius: "50%",
        }}
      />
    </div>
  );

  if (!user) return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#060A18",
      color: "rgba(255,255,255,0.4)", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15,
    }}>
      You are not logged in.
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#060A18", color: "#fff",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: "24px 20px", position: "relative", overflowX: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');

        .pf-input {
          width: 100%; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
          padding: 14px 16px; color: #fff; font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif; outline: none;
          transition: border-color .25s, background .25s, box-shadow .25s;
          box-sizing: border-box;
        }
        .pf-input::placeholder { color: rgba(255,255,255,0.25); }
        .pf-input:focus {
          border-color: rgba(45,212,191,0.5); background: rgba(45,212,191,0.04);
          box-shadow: 0 0 0 4px rgba(45,212,191,0.1);
        }
        textarea.pf-input { resize: vertical; min-height: 100px; line-height: 1.5; }

        .pf-file-label {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.15);
          border-radius: 12px; padding: 12px 16px; cursor: pointer; transition: all .25s;
        }
        .pf-file-label:hover { border-color: rgba(45,212,191,0.4); background: rgba(45,212,191,0.04); }

        .pf-tab {
          padding: 10px 24px; border-radius: 12px; border: none;
          font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all .25s;
        }
        .pf-tab.active   { background: rgba(45,212,191,0.12); border: 1px solid rgba(45,212,191,0.3); color: #2DD4BF; box-shadow: 0 4px 12px rgba(45,212,191,0.1); }
        .pf-tab.inactive { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); }
        .pf-tab.inactive:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.02); }

        .pf-save {
          padding: 14px 32px; background: linear-gradient(135deg,#2DD4BF,#0EA5E9);
          border: none; border-radius: 12px; color: #060A18;
          font-size: 15px; font-weight: 800; cursor: pointer;
          transition: transform .25s, box-shadow .25s;
          font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em;
        }
        .pf-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(45,212,191,0.35); }
        .pf-save:disabled { opacity: .6; cursor: not-allowed; }

        .overview-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 20px;
        }
        .edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .full-span { grid-column: 1 / -1; }
        
        @media (max-width: 768px) {
          .edit-grid { grid-template-columns: 1fr; }
          .overview-grid { grid-template-columns: 1fr; }
        }

        .doc-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(45,212,191,0.08); border: 1px solid rgba(45,212,191,0.25);
          border-radius: 10px; padding: 8px 14px;
          font-size: 13px; font-weight: 700; color: #2DD4BF;
          text-decoration: none; transition: background .2s, transform .2s;
        }
        .doc-pill:hover { background: rgba(45,212,191,0.15); transform: translateY(-1px); }
      `}</style>

      {/* ambient blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)",
          top: "-10%", left: "-10%", filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          bottom: "-10%", right: "-5%", filter: "blur(80px)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto" }}>

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: "32px", marginBottom: 24,
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg,transparent,rgba(45,212,191,0.8),rgba(14,165,233,0.6),transparent)",
          }} />

          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* avatar */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              style={{
                width: 84, height: 84, borderRadius: 24, flexShrink: 0,
                background: "linear-gradient(135deg,#2DD4BF 0%,#0EA5E9 60%,#6366f1 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 34, fontWeight: 900, color: "#060A18",
                boxShadow: "0 12px 36px rgba(45,212,191,0.3)",
                fontFamily: "'Fraunces', serif",
              }}
            >{initials}</motion.div>

            {/* name + badges */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                <h1 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900,
                  letterSpacing: "-0.5px", margin: 0, textTransform: "capitalize",
                }}>{displayName}</h1>
                {isProvider && user.isProfessional && (
                  <span style={{
                    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 12, fontWeight: 800, color: "#818cf8", letterSpacing: "0.05em",
                  }}>PRO</span>
                )}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: "0 0 16px", fontFamily: "'JetBrains Mono',monospace" }}>
                {user.email}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <StatusBadge value={user.role} map={roleMap} />
                {isProvider
                  ? <StatusBadge value={user.verificationStatus} map={verificationMap} />
                  : <StatusBadge value={user.status} map={statusMap} />
                }
              </div>
            </div>

            {/* quick meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", minWidth: 160 }}>
              {[
                { label: "Member since", val: memberSince },
                { label: "Last updated",  val: lastUpdated },
                { label: "Account ID",    val: user._id?.slice(-10), mono: true, dim: true },
              ].map(({ label, val, mono, dim }) => (
                <div key={label} style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{label}</p>
                  <p style={{
                    fontSize: dim ? 12 : 14, fontWeight: 700, margin: 0,
                    color: dim ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.7)",
                    fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit",
                  }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`pf-tab ${activeTab === tab ? "active" : "inactive"}`}
              onClick={() => {
                if (tab === "Edit Profile") setForm(initForm(user));
                setSaveError("");
                setActiveTab(tab);
              }}
            >{tab}</button>
          ))}
        </div>

        {/* ── PANELS ── */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
              className="overview-grid"
            >
              {/* Account Info — always */}
              <SectionCard title="Account Info" icon="◎" accentColor="#2DD4BF" delay={0}>
                <Field label="Username"     value={user.username} mono />
                <Field label="Email"        value={user.email}    mono />
                <Field label="Role"         value={user.role?.replace(/_/g, " ")}     accent={roleMap[user.role]?.color} />
                <Field label="Account Type" value={isProvider ? "Service Provider" : "Standard User"} />
              </SectionCard>

              {/* User — personal */}
              {!isProvider && (
                <SectionCard title="Personal Details" icon="✦" accentColor="#818cf8" delay={0.08}>
                  <Field label="Full Name"    value={user.fullName} />
                  <Field label="Phone Number" value={user.phoneNumber} />
                  <Field label="Status"       value={user.status} accent={statusMap[user.status]?.color} />
                  <Field label="Timezone"     value={user.timezone} />
                </SectionCard>
              )}

              {/* User — location */}
              {!isProvider && (
                <SectionCard title="Location" icon="◉" accentColor="#34D399" delay={0.12}>
                  <Field label="Address"  value={user.address} />
                  <Field label="State"    value={user.state} />
                  <Field label="Country"  value={user.country} />
                  <Field label="Pin Code" value={user.pinCode} />
                </SectionCard>
              )}

              {/* Provider — service */}
              {isProvider && (
                <SectionCard title="Service Details" icon="⬡" accentColor="#F59E0B" delay={0.08}>
                  <Field label="Service Type"  value={user.serviceType} />
                  <Field label="Phone"         value={user.phone} />
                  <Field label="Experience"    value={user.experience} />
                  <Field label="Professional?" value={user.isProfessional ? "Yes ✓" : "No"} accent={user.isProfessional ? "#34D399" : undefined} />
                </SectionCard>
              )}

              {/* Provider — location */}
              {isProvider && (
                <SectionCard title="Service Location" icon="◉" accentColor="#34D399" delay={0.12}>
                  <Field label="Street / Area"  value={user.address?.street} />
                  <Field label="City"    value={user.address?.city} />
                  <Field label="Pincode" value={user.address?.pincode} />
                  <Field label="Full Address"    value={formatAddress(user.address)} />
                </SectionCard>
              )}

              {/* Bio — always */}
              <SectionCard title="Biography" icon="✎" accentColor="#e879f9" delay={0.16}>
                <div style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 12, padding: "16px",
                  fontSize: 14, lineHeight: 1.7, minHeight: 80,
                  color: user.bio ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                }}>{user.bio || "No biography provided yet."}</div>
              </SectionCard>

              {/* Provider — time slots */}
              {isProvider && (
                <SectionCard title="Available Time Slots" icon="⏰" accentColor="#0EA5E9" delay={0.2}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {user.timeSlots?.length > 0 ? user.timeSlots.map((slot, i) => (
                      <span key={i} style={{
                        background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)",
                        borderRadius: 8, padding: "8px 16px",
                        fontSize: 13, fontWeight: 700, color: "#38bdf8",
                      }}>{slot}</span>
                    )) : <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>No time slots added</span>}
                  </div>
                </SectionCard>
              )}

              {/* Provider — verification + docs */}
              {isProvider && (
                <SectionCard title="Verification & Docs" icon="🔐" accentColor="#F59E0B" delay={0.24}>
                  <Field label="Verification Status" value={user.verificationStatus} accent={verificationMap[user.verificationStatus]?.color} />
                  {user.deletionDate && (
                    <Field label="Scheduled Deletion" value={new Date(user.deletionDate).toLocaleDateString()} accent="#F87171" />
                  )}
                  <div style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 12, padding: "16px", marginTop: 8
                  }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                      Uploaded Documents
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {user.documents?.idProof
                        ? <a href={getFileUrl(user.documents.idProof)} target="_blank" rel="noreferrer" className="doc-pill">🪪 ID Proof</a>
                        : <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No ID Proof</span>}
                      
                      {user.documents?.photoproof
                        ? <a href={getFileUrl(user.documents.photoproof)} target="_blank" rel="noreferrer" className="doc-pill">📷 Photo Proof</a>
                        : <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No Photo</span>}
                      
                      {user.documents?.certification && (
                        <a href={getFileUrl(user.documents.certification)} target="_blank" rel="noreferrer" className="doc-pill">📜 Certification</a>
                      )}
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* Activity — always */}
              <SectionCard title="Activity Log" icon="📅" accentColor="#94a3b8" delay={0.28}>
                <Field label="Created At" value={user.createdAt ? new Date(user.createdAt).toLocaleString("en-IN") : "—"} />
                <Field label="Last Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleString("en-IN") : "—"} />
              </SectionCard>
            </motion.div>
          )}

          {/* EDIT */}
          {activeTab === "Edit Profile" && (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              style={{
                background: "rgba(10, 14, 28, 0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 24, padding: "32px",
                position: "relative", overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent)",
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  boxShadow: "0 0 12px rgba(245,158,11,0.2)"
                }}>◈</div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px", margin: 0, color: "#fff" }}>
                  {isProvider ? "Edit Provider Profile" : "Edit User Profile"}
                </h3>
              </div>

              <div className="edit-grid">

                {/* provider fields */}
                {isProvider && <>
                  {[
                    { name: "serviceType", label: "Service Type", placeholder: "e.g. Plumbing, Design…" },
                    { name: "phone",       label: "Phone Number", placeholder: "+91 XXXXXXXXXX" },
                    { name: "experience",  label: "Experience",   placeholder: "e.g. 5 years" },
                    { name: "timeSlots",   label: "Time Slots",   placeholder: "9AM, 2PM, 6PM (comma-separated)" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{f.label}</label>
                      <input className="pf-input" name={f.name} value={form[f.name] ?? ""} onChange={handleChange} placeholder={f.placeholder} />
                    </div>
                  ))}

                  <div className="full-span" style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />

                  {[
                    { name: "street",  label: "Street Address", placeholder: "House No, Street / Area", full: true },
                    { name: "city",    label: "City",    placeholder: "City name" },
                    { name: "pincode", label: "Pincode", placeholder: "123456" },
                  ].map((f) => (
                    <div key={f.name} className={f.full ? "full-span" : ""}>
                      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{f.label}</label>
                      <input className="pf-input" name={f.name} value={form[f.name] ?? ""} onChange={handleChange} placeholder={f.placeholder} />
                    </div>
                  ))}

                  <div className="full-span" style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />

                  {/* Documents with existing links */}
                  <div className="full-span">
                    <h4 style={{ fontSize: 14, color: "#fff", marginBottom: 16, marginTop: 0 }}>Required Documents</h4>
                    <div className="edit-grid" style={{ gap: 12 }}>
                      {[
                        { label: "ID Proof",      state: idProof,       setter: setIdProof,       existing: user.documents?.idProof },
                        { label: "Photo Proof",   state: photoproof,    setter: setPhotoproof,    existing: user.documents?.photoproof },
                        { label: "Certification", state: certification, setter: setCertification, existing: user.documents?.certification },
                      ].map((f) => (
                        <div key={f.label} style={{ 
                          background: "rgba(255,255,255,0.02)", padding: "16px", 
                          borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" 
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                              {f.label}
                            </label>
                            {f.existing && (
                              <a href={getFileUrl(f.existing)} target="_blank" rel="noopener noreferrer" 
                                style={{ fontSize: 12, color: "#2DD4BF", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                ↗ View Current
                              </a>
                            )}
                          </div>
                          <label className="pf-file-label">
                            <span style={{ fontSize: 13, color: f.state ? "#2DD4BF" : "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>
                              {f.state ? `✓ ${f.state.name}` : `Upload new ${f.label.toLowerCase()}`}
                            </span>
                            <span style={{ background: "linear-gradient(135deg,#2DD4BF,#0EA5E9)", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 800, color: "#060A18" }}>Browse</span>
                            <input type="file" style={{ display: "none" }} onChange={(e) => f.setter(e.target.files[0])} />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>}

                {/* user fields */}
                {!isProvider && <>
                  {[
                    { name: "fullName",    label: "Full Name",    placeholder: "Your full name" },
                    { name: "phoneNumber", label: "Phone Number", placeholder: "+91 XXXXXXXXXX" },
                    { name: "address",     label: "Address",      placeholder: "Street / area", full: true },
                    { name: "state",       label: "State",        placeholder: "State" },
                    { name: "country",     label: "Country",      placeholder: "Country" },
                    { name: "pinCode",     label: "Pin Code",     placeholder: "123456" },
                  ].map((f) => (
                    <div key={f.name} className={f.full ? "full-span" : ""}>
                      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{f.label}</label>
                      <input className="pf-input" name={f.name} value={form[f.name] ?? ""} onChange={handleChange} placeholder={f.placeholder} />
                    </div>
                  ))}
                </>}

                {/* Bio — shared, full width */}
                <div className="full-span" style={{ marginTop: 8 }}>
                  <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Biography</label>
                  <textarea className="pf-input" name="bio" value={form.bio ?? ""} onChange={handleChange} placeholder="Tell us about yourself…" />
                </div>
              </div>

              {saveError && (
                <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "12px 16px", marginTop: 20 }}>
                  <p style={{ color: "#F87171", fontSize: 14, margin: 0, fontWeight: 600 }}>⚠ {saveError}</p>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  type="button"
                  onClick={() => { setSaveError(""); setActiveTab("Overview"); }}
                  style={{
                    padding: "14px 24px", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                    color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >Cancel</button>
                <button className="pf-save" type="submit" disabled={saving}>
                  {saving ? "Saving Changes…" : "Save Changes →"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProviderProfile;
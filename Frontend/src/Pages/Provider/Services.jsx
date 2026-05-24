import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const formatAddress = (addr) => {
  if (!addr) return "Not provided";
  if (typeof addr === "string") return addr;
  const formatted = [addr.street, addr.city, addr.pincode].filter(Boolean).join(", ");
  return formatted || "Not provided";
};

const MyServices = () => {
  const { user, setUser } = useContext(UserContext);
  const [newSlot, setNewSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(user?.fixedPrice || "");
  const [priceLoading, setPriceLoading] = useState(false);

  const addSlot = async () => {
    if (!newSlot.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/myservice/slots/add`,
        { slot: newSlot }
      );
      setUser((prev) => ({ ...prev, timeSlots: res.data.data.timeSlots }));
      setNewSlot("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding slot");
    } finally {
      setLoading(false);
    }
  };

  const removeSlot = async (slot) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND}/api/myservice/slots/remove`,
        { data: { slot } }
      );
      setUser((prev) => ({ ...prev, timeSlots: res.data.data.timeSlots }));
    } catch (err) {
      alert(err.response?.data?.message || "Error removing slot");
    }
  };

  const updatePrice = async () => {
    if (newPrice === "" || newPrice < 0) return;
    try {
      setPriceLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/myservice/price`,
        { price: newPrice }
      );
      setUser((prev) => ({ ...prev, fixedPrice: res.data.data.fixedPrice }));
      setIsEditingPrice(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating price");
    } finally {
      setPriceLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addSlot();
  };

  return (
    <div
      style={{
        background: "#080C1C",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        minHeight: "100%",
        padding: "0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,ital,wght@9..144,0,700;9..144,0,900;9..144,1,700;9..144,1,900&display=swap');

        .ms-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 16px;
        }
        @media (min-width: 640px) {
          .ms-grid { padding: 20px; gap: 20px; }
        }
        @media (min-width: 1024px) {
          .ms-grid {
            grid-template-columns: 340px 1fr;
            padding: 28px;
            gap: 24px;
            align-items: start;
          }
        }
        @media (min-width: 1280px) {
          .ms-grid { grid-template-columns: 360px 1fr; }
        }

        .ms-panel {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }
        @media (min-width: 480px) {
          .ms-panel { padding: 24px; }
        }
        @media (min-width: 768px) {
          .ms-panel { padding: 28px; border-radius: 24px; }
        }

        /* Right panel needs to fill remaining height on desktop */
        @media (min-width: 1024px) {
          .ms-panel-right {
            display: flex;
            flex-direction: column;
          }
        }

        .ms-slot-list {
          overflow-y: auto;
          flex: 1;
        }
        @media (max-width: 1023px) {
          .ms-slot-list { max-height: 300px; }
        }
        @media (min-width: 1024px) {
          .ms-slot-list { max-height: 380px; }
        }

        /* Price edit row — stacks on very small screens */
        .price-edit-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        /* Metadata info rows */
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        .meta-label { color: rgba(255,255,255,0.4); font-weight: 500; white-space: nowrap; flex-shrink: 0; }
        .meta-value {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
          max-width: 180px;
        }
        @media (min-width: 480px) {
          .meta-value { max-width: 220px; }
        }

        /* Slot add bar */
        .slot-add-bar {
          display: flex;
          gap: 10px;
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .slot-input {
          flex: 1;
          min-width: 0;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 11px 14px;
          border-radius: 12px;
          outline: none;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          transition: border-color 0.25s, background 0.25s;
        }
        .slot-input::placeholder { color: rgba(255,255,255,0.25); }
        .slot-input:focus {
          border-color: rgba(45,212,191,0.5);
          background: rgba(255,255,255,0.05);
        }
        @media (min-width: 640px) {
          .slot-input { padding: 12px 16px; font-size: 14px; }
        }

        .slot-add-btn {
          background: linear-gradient(135deg, #2DD4BF, #0EA5E9);
          color: #080C1C;
          border: none;
          padding: 11px 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          font-family: inherit;
          box-shadow: 0 6px 18px rgba(45,212,191,0.2);
        }
        .slot-add-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(45,212,191,0.35);
        }
        .slot-add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        @media (min-width: 640px) {
          .slot-add-btn { padding: 12px 22px; font-size: 14px; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>

      <div className="ms-grid">

        {/* ── LEFT PANEL: Profile ── */}
        <div className="ms-panel">
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: "-25%", right: "-20%",
            width: 220, height: 220,
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%)",
            pointerEvents: "none", filter: "blur(30px)",
          }} />

          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(20px, 3vw, 24px)",
            fontWeight: 900,
            marginBottom: 20,
            color: "#fff",
            position: "relative", zIndex: 1,
          }}>My Profile</h2>

          {/* Service Category */}
          <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
              Service Category
            </p>
            <h3 style={{
              fontSize: "clamp(18px, 3vw, 22px)",
              fontWeight: 700,
              background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              display: "inline-block",
              lineHeight: 1.2,
            }}>
              {user?.serviceType || "Not Set"}
            </h3>
          </div>

          {/* Specialization */}
          {user?.specialization && (
            <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
                Specialization
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 12px", borderRadius: 12,
                background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.2)",
                maxWidth: "100%",
              }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>🎯</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(45,212,191,0.9)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.specialization}
                </span>
              </div>
            </div>
          )}

          {/* Fixed Price */}
          <div style={{
            marginBottom: 20, position: "relative", zIndex: 1,
            padding: "14px 16px", borderRadius: 14,
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
              Fixed Price
            </p>

            {!isEditingPrice ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#34D399", lineHeight: 1 }}>
                  ₹{user?.fixedPrice ?? 0}
                </span>
                <button
                  onClick={() => { setIsEditingPrice(true); setNewPrice(user?.fixedPrice || ""); }}
                  style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: "#2DD4BF", border: "1px solid rgba(45,212,191,0.3)",
                    padding: "4px 12px", borderRadius: 8,
                    background: "transparent", cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.background = "rgba(45,212,191,0.1)"}
                  onMouseLeave={e => e.target.style.background = "transparent"}
                >
                  Edit Price
                </button>
              </div>
            ) : (
              <div className="price-edit-row">
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                  New: ₹
                </span>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{
                    width: 80, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "6px 10px", color: "#fff", outline: "none",
                    fontSize: 14, fontFamily: "monospace", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#34D399"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  placeholder="0"
                />
                <button
                  onClick={updatePrice}
                  disabled={priceLoading}
                  style={{
                    fontSize: 11, fontWeight: 700, color: "#34D399",
                    background: "rgba(52,211,153,0.15)", border: "none",
                    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                    fontFamily: "inherit", opacity: priceLoading ? 0.5 : 1,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => !priceLoading && (e.target.style.background = "rgba(52,211,153,0.25)")}
                  onMouseLeave={e => e.target.style.background = "rgba(52,211,153,0.15)"}
                >
                  {priceLoading ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setIsEditingPrice(false)}
                  style={{
                    fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div style={{ marginBottom: 20, position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 700,
              ...(user?.role === "approved_provider"
                ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }
                : { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }
              ),
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: user?.role === "approved_provider" ? "#34D399" : "#F59E0B",
                animation: user?.role !== "approved_provider" ? "pulse 1.5s infinite" : "none",
                flexShrink: 0,
              }} />
              {user?.role === "approved_provider" ? "Verified Provider" : "Pending Verification"}
            </span>
          </div>

          {/* Info Rows */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "14px 16px", borderRadius: 16,
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {[
              { label: "Name", value: user?.username },
              { label: "Email", value: user?.email },
              { label: "Address", value: formatAddress(user?.address) },
            ].map(({ label, value }) => (
              <div key={label} className="meta-row">
                <span className="meta-label">{label}</span>
                <span className="meta-value" title={value}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: Slots ── */}
        <div className="ms-panel ms-panel-right">
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: "-20%", left: "-10%",
            width: 220, height: 220,
            background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)",
            pointerEvents: "none", filter: "blur(30px)",
          }} />

          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(20px, 3vw, 24px)",
            fontWeight: 900,
            marginBottom: 20,
            color: "#fff",
            position: "relative", zIndex: 1,
          }}>
            Available{" "}
            <span style={{ fontStyle: "italic", color: "#0EA5E9" }}>Slots</span>
          </h2>

          {/* Slot count badge */}
          {user?.timeSlots?.length > 0 && (
            <div style={{
              position: "absolute", top: 24, right: 24, zIndex: 2,
              background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.25)",
              borderRadius: 8, padding: "3px 10px",
              fontSize: 11, fontWeight: 700, color: "#0EA5E9",
            }}>
              {user.timeSlots.length} slot{user.timeSlots.length !== 1 ? "s" : ""}
            </div>
          )}

          {/* Slot List */}
          <div className="ms-slot-list custom-scrollbar" style={{ position: "relative", zIndex: 1, marginBottom: 8 }}>
            <AnimatePresence>
              {!user?.timeSlots || user.timeSlots.length === 0 ? (
                <div style={{
                  minHeight: 160, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.2)", fontSize: 14, gap: 8,
                }}>
                  <span style={{ fontSize: 28, opacity: 0.4 }}>⏰</span>
                  <p style={{ margin: 0, fontWeight: 500 }}>No slots added yet.</p>
                  <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>Add a time slot below to get started.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
                  {user.timeSlots.map((slot) => (
                    <motion.div
                      key={slot}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        gap: 12,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "12px 14px",
                        borderRadius: 14,
                        transition: "background 0.2s, border-color 0.2s",
                        cursor: "default",
                      }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.055)", borderColor: "rgba(14,165,233,0.25)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: "rgba(255,255,255,0.04)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, flexShrink: 0,
                        }}>
                          🕒
                        </div>
                        <span style={{
                          color: "rgba(255,255,255,0.8)", fontWeight: 500,
                          fontSize: 14, letterSpacing: "0.01em",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {slot}
                        </span>
                      </div>
                      <button
                        onClick={() => removeSlot(slot)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                          letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)",
                          padding: "4px 8px", borderRadius: 6, flexShrink: 0,
                          fontFamily: "inherit", transition: "color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => { e.target.style.color = "#FB923C"; e.target.style.background = "rgba(251,146,60,0.08)"; }}
                        onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.25)"; e.target.style.background = "none"; }}
                      >
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Slot Bar */}
          <div className="slot-add-bar" style={{ position: "relative", zIndex: 1 }}>
            <input
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 10:00 AM – 11:30 AM"
              className="slot-input"
            />
            <button
              onClick={addSlot}
              disabled={loading || !newSlot.trim()}
              className="slot-add-btn"
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{
                    width: 14, height: 14, border: "2px solid #080C1C",
                    borderTopColor: "transparent", borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Adding
                </span>
              ) : (
                "Add Slot"
              )}
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export { MyServices };
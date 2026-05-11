
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

axios.defaults.withCredentials = true;

const ProviderProfile = () => {
  const [provider, setProvider] = useState(null);

  const [form, setForm] = useState({
    serviceType: "",
    address: "",
    timeSlots: "",
  });

  const [idProof, setIdProof] = useState(null);
  const [photoproof, setPhotoproof] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/providerProfile/me");
      setProvider(res.data);
      setForm({
        serviceType: res.data.serviceType || "",
        address: res.data.address || "",
        timeSlots: res.data.timeSlots?.join(",") || "",
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("serviceType", form.serviceType);
    formData.append("address", form.address);
    formData.append("timeSlots", JSON.stringify(form.timeSlots.split(",")));
    if (idProof) formData.append("idProof", idProof);
    if (photoproof) formData.append("photoproof", photoproof);
    try {
      const res = await axios.put("http://localhost:3000/api/providerProfile/update", formData);
      setProvider(res.data.provider);
      alert("Profile updated successfully");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (!provider)
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        minHeight: "100vh", background: "#080C1C", color: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{
            width: 40, height: 40,
            border: "2px solid rgba(255,255,255,0.08)",
            borderTop: "2px solid #2DD4BF",
            borderRadius: "50%",
          }}
        />
      </div>
    );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C1C",
      color: "#fff",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: "24px",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

        .shimmer-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(45,212,191,0.5), rgba(245,158,11,0.5), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .profile-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .profile-input::placeholder { color: rgba(255,255,255,0.25); }
        .profile-input:focus {
          border-color: rgba(45,212,191,0.4);
          background: rgba(45,212,191,0.04);
          box-shadow: 0 0 0 3px rgba(45,212,191,0.08);
        }

        .file-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 13px 16px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .file-label:hover {
          border-color: rgba(45,212,191,0.3);
          background: rgba(45,212,191,0.04);
        }

        .btn-update {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2DD4BF, #0EA5E9);
          border: none;
          border-radius: 12px;
          color: #080C1C;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em;
          position: relative;
          overflow: hidden;
        }
        .btn-update::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .btn-update:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(45,212,191,0.35);
        }
        .btn-update:hover::after { opacity: 1; }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
            top: "-10%", left: "-10%", borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute", width: 400, height: 400,
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
            bottom: "-10%", right: "-10%", borderRadius: "50%",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "rgba(8,12,28,0.9)",
            border: "1px solid rgba(45,212,191,0.18)",
            borderRadius: 24,
            padding: "28px 32px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 20,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            flexWrap: "wrap",
          }}
        >
          <div className="shimmer-line" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 250, height: 200, background: "radial-gradient(circle at top right, rgba(45,212,191,0.12), transparent 60%)", pointerEvents: "none" }} />

          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: 72, height: 72, borderRadius: 20,
              background: "linear-gradient(135deg, #2DD4BF, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 900, color: "#080C1C",
              boxShadow: "0 10px 30px rgba(45,212,191,0.3)",
              flexShrink: 0,
            }}
          >
            {provider.username?.charAt(0)?.toUpperCase()}
          </motion.div>

          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              margin: "0 0 4px",
              textTransform: "capitalize",
            }}>{provider.username}</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 10px" }}>
              {provider.email}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "rgba(45,212,191,0.1)",
                border: "1px solid rgba(45,212,191,0.25)",
                borderRadius: 20, padding: "4px 12px",
                fontSize: 12, fontWeight: 600, color: "#2DD4BF",
                textTransform: "capitalize",
              }}>◎ {provider.role}</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: provider.verificationStatus === "verified"
                  ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.1)",
                border: `1px solid ${provider.verificationStatus === "verified"
                  ? "rgba(52,211,153,0.25)" : "rgba(245,158,11,0.25)"}`,
                borderRadius: 20, padding: "4px 12px",
                fontSize: 12, fontWeight: 600,
                color: provider.verificationStatus === "verified" ? "#34D399" : "#F59E0B",
              }}>
                {provider.verificationStatus === "verified" ? "✓ Verified" : "⏳ Pending"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="profile-grid">
          {/* Details card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: "26px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(45,212,191,0.4), transparent)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "rgba(45,212,191,0.1)",
                border: "1px solid rgba(45,212,191,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#2DD4BF",
              }}>✦</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18, fontWeight: 800,
                letterSpacing: "-0.3px", margin: 0,
              }}>Provider Details</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Service Type", value: provider.serviceType || "Not set", icon: "⬡" },
                { label: "Address", value: provider.address || "Not set", icon: "◎" },
                { label: "Status", value: provider.verificationStatus, icon: "✦", accent: "#2DD4BF" },
              ].map((d, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "12px 16px",
                }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {d.icon} {d.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: d.accent || "rgba(255,255,255,0.8)" }}>
                    {d.value}
                  </p>
                </div>
              ))}

              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "14px 16px",
              }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ⏰ Available Slots
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {provider.timeSlots?.length > 0 ? provider.timeSlots.map((slot, i) => (
                    <span key={i} style={{
                      background: "rgba(45,212,191,0.08)",
                      border: "1px solid rgba(45,212,191,0.2)",
                      borderRadius: 8, padding: "5px 12px",
                      fontSize: 13, fontWeight: 600, color: "#2DD4BF",
                    }}>{slot}</span>
                  )) : (
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No slots added</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Edit form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 22,
              padding: "26px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#F59E0B",
              }}>◈</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18, fontWeight: 800,
                letterSpacing: "-0.3px", margin: 0,
              }}>Edit Profile</h2>
            </div>

            {[
              { name: "serviceType", placeholder: "Service Type (e.g. Plumbing, Design...)" },
              { name: "address", placeholder: "Full Address" },
              { name: "timeSlots", placeholder: "Time Slots (comma-separated, e.g. 9AM, 2PM)" },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {field.name.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  className="profile-input"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {/* File uploads */}
            {[
              { label: "ID Proof", state: idProof, setter: setIdProof },
              { label: "Photo Proof", state: photoproof, setter: setPhotoproof },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {f.label}
                </label>
                <label className="file-label">
                  <span style={{ fontSize: 14, color: f.state ? "#2DD4BF" : "rgba(255,255,255,0.35)" }}>
                    {f.state ? `✓ ${f.state.name}` : `Choose ${f.label} file`}
                  </span>
                  <span style={{
                    background: "linear-gradient(135deg, #2DD4BF, #0EA5E9)",
                    borderRadius: 8, padding: "5px 14px",
                    fontSize: 12, fontWeight: 700, color: "#080C1C",
                  }}>Upload</span>
                  <input type="file" style={{ display: "none" }} onChange={(e) => f.setter(e.target.files[0])} />
                </label>
              </div>
            ))}

            <button className="btn-update" type="submit" style={{ marginTop: 4 }}>
              Update Profile →
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export { ProviderProfile };
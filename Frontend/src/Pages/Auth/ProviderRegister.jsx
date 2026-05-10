import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

// ─── Constants ───────────────────────────────────────────────────────────────

const PROFESSIONAL_SERVICES = new Set([
  "Doctor", "Tutor", "Fitness Trainer", "Photographer",
  "Event Planner", "Computer Technician", "Lawyer", "Architect", "Nurse",
]);

const ALL_SERVICES = [
  { category: "Professional", items: ["Doctor", "Nurse", "Lawyer", "Architect", "Tutor", "Fitness Trainer", "Photographer", "Computer Technician", "Event Planner"] },
  { category: "Trade & Home", items: ["Electrician", "Plumber", "Carpenter", "Mechanic", "Painter", "AC Technician"] },
  { category: "Lifestyle", items: ["Cook", "Cleaner", "Driver", "Beautician"] },
];

const EXPERIENCE_OPTIONS = [
  { value: "< 1 year", label: "< 1 year" },
  { value: "1–2 years", label: "1–2 years" },
  { value: "3–5 years", label: "3–5 years" },
  { value: "5–10 years", label: "5–10 years" },
  { value: "10+ years", label: "10+ years" },
];

const STEPS = [
  { id: "personal", label: "Identity", icon: "👤" },
  { id: "service", label: "Service", icon: "🔧" },
  { id: "docs", label: "Documents", icon: "📋" },
  { id: "review", label: "Review", icon: "✅" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Field = ({ label, hint, error, children }) => (
  <div>
    <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-teal-400/70 mb-1.5">
      {label}
      {hint && <span className="ml-2 text-slate-600 normal-case font-normal tracking-normal">{hint}</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const TextInput = ({ name, type = "text", placeholder, value, onChange, icon }) => (
  <div className="relative">
    {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">{icon}</span>}
    <input
      name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} autoComplete="off"
      className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl
        bg-slate-900/60 border border-slate-700/40
        text-slate-100 placeholder-slate-600 text-sm font-mono
        focus:outline-none focus:border-teal-500/50 focus:bg-slate-900/80
        transition-all duration-200`}
    />
  </div>
);

const DocUpload = ({ name, label, description, accept, file, onChange, required, icon }) => {
  const done = !!file;
  return (
    <label className={`block cursor-pointer group transition-all duration-300 rounded-2xl border-2 border-dashed p-5 relative overflow-hidden
      ${done ? "border-teal-500/40 bg-teal-950/15" : "border-slate-700/40 bg-slate-900/20 hover:border-slate-600/50 hover:bg-slate-900/40"}`}>
      <input type="file" name={name} accept={accept} onChange={onChange} className="hidden" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-r from-transparent via-teal-500/5 to-transparent -skew-x-12 pointer-events-none" />
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-all duration-300
          ${done ? "bg-teal-500/20" : "bg-slate-800/80 group-hover:bg-slate-800"}`}>
          {done ? "✓" : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`text-sm font-semibold ${done ? "text-teal-300" : "text-slate-300"}`}>{label}</p>
            {required && (
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                REQUIRED
              </span>
            )}
          </div>
          {done
            ? <p className="text-xs text-teal-400/60 truncate font-mono">{file.name}</p>
            : <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
          }
        </div>
        <div className={`text-[10px] font-bold tracking-wider flex-shrink-0 mt-1 transition-colors
          ${done ? "text-teal-400" : "text-slate-600 group-hover:text-slate-400"}`}>
          {done ? "DONE" : "UPLOAD"}
        </div>
      </div>
    </label>
  );
};

const ReviewSection = ({ title, icon, rows }) => (
  <div className="rounded-xl border border-slate-800/60 overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-3 bg-slate-900/50 border-b border-slate-800/60">
      <span className="text-sm">{icon}</span>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">{title}</p>
    </div>
    <div className="divide-y divide-slate-800/40">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-start px-5 py-2.5 gap-4">
          <span className="text-xs text-slate-600 flex-shrink-0 mt-0.5">{label}</span>
          <span className="text-sm text-slate-200 text-right font-mono break-all">{value || "—"}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ProviderRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    serviceType: "", experience: "", address: "", city: "", pincode: "", bio: "",
  });

  const [files, setFiles] = useState({ idProof: null, photoproof: null, certification: null });

  const isProfessional = PROFESSIONAL_SERVICES.has(form.serviceType);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" })); // 'e' is also shadowed here!
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFiles(f => ({ ...f, [name]: files[0] }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
      if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit phone number";
      if (form.password.length < 6) e.password = "Minimum 6 characters required";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    if (step === 1) {
      if (!form.serviceType) e.serviceType = "Select your service category";
      if (!form.experience) e.experience = "Select experience level";
      if (!form.address.trim()) e.address = "Street address required";
      if (!form.city.trim()) e.city = "City is required";
      if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit PIN";
    }
    if (step === 2) {
      if (!files.idProof) e.idProof = "Government ID proof is required";
      if (!files.photoproof) e.photoproof = "Your photograph is required";
      if (isProfessional && !files.certification) e.certification = "Professional certification is required for this service";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (!validate()) return; setDirection(1); setStep(s => s + 1); };
  const prev = () => { setDirection(-1); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k !== "confirmPassword") data.append(k, v); });
      data.append("idProof", files.idProof);
      data.append("photoproof", files.photoproof);
      if (isProfessional && files.certification) data.append("certification", files.certification);
      data.append("isProfessional", isProfessional);

      await axios.post("http://localhost:3000/api/auth/register/provider", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const stepContent = [
    // STEP 0 — Identity
    <div key="s0" className="space-y-4">
      <div className="rounded-xl border border-teal-500/12 bg-teal-950/10 p-3.5">
        <p className="text-xs text-teal-400/60 leading-relaxed">
          🔐 Your information is encrypted and used solely for identity verification.
        </p>
      </div>
      <Field label="Full Name" error={errors.name}>
        <TextInput name="name" placeholder="As per government ID" value={form.name} onChange={handleChange} icon="👤" />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email}>
          <TextInput name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} icon="✉️" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <TextInput name="phone" placeholder="10-digit number" value={form.phone} onChange={handleChange} icon="📱" />
        </Field>
      </div>
      <Field label="Password" error={errors.password}>
        <TextInput name="password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} icon="🔑" />
      </Field>
      <Field label="Confirm Password" error={errors.confirmPassword}>
        <TextInput name="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} icon="🔒" />
      </Field>
    </div>,

    // STEP 1 — Service Details
    <div key="s1" className="space-y-4">
      <Field label="Service Category" error={errors.serviceType}>
        <div className="relative">
          <select name="serviceType" value={form.serviceType} onChange={handleChange}
            className="w-full pl-4 pr-8 py-3 rounded-xl appearance-none
              bg-slate-900/60 border border-slate-700/40 text-slate-100 text-sm font-mono
              focus:outline-none focus:border-teal-500/50 transition-all duration-200">
            <option value="" className="bg-slate-900 text-slate-500">— Select your service —</option>
            {ALL_SERVICES.map(({ category, items }) => (
              <optgroup key={category} label={`── ${category} ──`} className="bg-slate-900 text-slate-400">
                {items.map(s => <option key={s} value={s} className="bg-slate-900 text-slate-100">{s}</option>)}
              </optgroup>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▾</span>
        </div>
        <AnimatePresence>
          {form.serviceType && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider
                ${isProfessional
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-teal-500/10 border border-teal-500/20 text-teal-400"}`}>
              {isProfessional ? "⭐ PROFESSIONAL — 3 documents required" : "🔧 STANDARD — ID & photo only"}
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

      <Field label="Experience Level" error={errors.experience}>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {EXPERIENCE_OPTIONS.map(({ value, label }) => (
            <button key={value} type="button"
              onClick={() => { setForm(f => ({ ...f, experience: value })); setErrors(e => ({ ...e, experience: "" })); }}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold tracking-wide border transition-all duration-200
                ${form.experience === value
                  ? "bg-teal-500/15 border-teal-500/40 text-teal-300"
                  : "bg-slate-900/40 border-slate-700/40 text-slate-500 hover:border-slate-600 hover:text-slate-300"}`}>
              {label}
            </button>
          ))}
        </div>
        {errors.experience && <p className="mt-1.5 text-[11px] text-rose-400">⚠ {errors.experience}</p>}
      </Field>

      <Field label="Street Address" error={errors.address}>
        <TextInput name="address" placeholder="House no., street, landmark" value={form.address} onChange={handleChange} icon="🏠" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="City" error={errors.city}>
          <TextInput name="city" placeholder="Your city" value={form.city} onChange={handleChange} />
        </Field>
        <Field label="PIN Code" error={errors.pincode}>
          <TextInput name="pincode" placeholder="6-digit PIN" value={form.pincode} onChange={handleChange} />
        </Field>
      </div>
      <Field label="Professional Bio" hint="(optional)">
        <textarea name="bio" placeholder="Describe your expertise and what you offer..." value={form.bio} onChange={handleChange} rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/40
            text-slate-100 placeholder-slate-600 text-sm font-mono
            focus:outline-none focus:border-teal-500/50 transition-all duration-200 resize-none" />
      </Field>
    </div>,

    // STEP 2 — Documents
    <div key="s2" className="space-y-4">
      <AnimatePresence mode="wait">
        {isProfessional ? (
          <motion.div key="pro" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-amber-500/20 bg-amber-950/12 p-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-400 text-lg">⭐</span>
              <div>
                <p className="text-sm font-bold text-amber-300 mb-0.5">Professional — 3 Documents Required</p>
                <p className="text-xs text-amber-400/55 leading-relaxed">
                  As a <strong className="text-amber-400">{form.serviceType}</strong>, you need to submit your government ID, a photograph, <em>and</em> your professional licence or certification.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="std" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-teal-500/15 bg-teal-950/10 p-4">
            <div className="flex items-start gap-3">
              <span className="text-teal-400 text-lg">🔧</span>
              <div>
                <p className="text-sm font-bold text-teal-300 mb-0.5">Standard — 2 Documents Required</p>
                <p className="text-xs text-teal-400/55 leading-relaxed">
                  Upload your government ID and a clear recent photograph. Verification takes 24–48 hours.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DocUpload name="idProof" label="Government ID Proof" required icon="🪪"
        description="Aadhaar, PAN, Passport, Voter ID or Driving Licence. JPG, PNG or PDF."
        accept="image/*,.pdf" file={files.idProof} onChange={handleFileChange} />
      {errors.idProof && <p className="text-[11px] text-rose-400 -mt-2">⚠ {errors.idProof}</p>}

      <DocUpload name="photoproof" label="Recent Photograph" required icon="🤳"
        description="Clear front-facing photo in good lighting. JPG or PNG only."
        accept="image/*" file={files.photoproof} onChange={handleFileChange} />
      {errors.photoproof && <p className="text-[11px] text-rose-400 -mt-2">⚠ {errors.photoproof}</p>}

      <AnimatePresence>
        {isProfessional && (
          <motion.div key="cert" initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <DocUpload name="certification" label="Professional Certification / Licence" required icon="📜"
              description="Degree certificate, professional licence, or any regulatory certification for your service."
              accept="image/*,.pdf" file={files.certification} onChange={handleFileChange} />
            {errors.certification && <p className="text-[11px] text-rose-400 mt-1">⚠ {errors.certification}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,

    // STEP 3 — Review
    <div key="s3" className="space-y-3">
      <ReviewSection title="Personal Identity" icon="👤" rows={[
        { label: "Full Name", value: form.name },
        { label: "Email", value: form.email },
        { label: "Phone", value: form.phone },
      ]} />
      <ReviewSection title="Service Details" icon="🔧" rows={[
        { label: "Service", value: form.serviceType },
        { label: "Category", value: isProfessional ? "Professional ⭐" : "Standard 🔧" },
        { label: "Experience", value: form.experience },
        { label: "Address", value: [form.address, form.city, form.pincode].filter(Boolean).join(", ") },
        ...(form.bio ? [{ label: "Bio", value: form.bio }] : []),
      ]} />
      <ReviewSection title="Documents" icon="📋" rows={[
        { label: "Government ID", value: files.idProof?.name },
        { label: "Photograph", value: files.photoproof?.name },
        ...(isProfessional ? [{ label: "Certification", value: files.certification?.name }] : []),
      ]} />
      {submitError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl border border-rose-500/25 bg-rose-950/15 p-3.5 text-sm text-rose-400">
          ⚠ {submitError}
        </motion.div>
      )}
      <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-3.5">
        <p className="text-[11px] text-slate-600 leading-relaxed text-center">
          By submitting you confirm all documents are authentic. False documents result in a permanent ban.
        </p>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 90% 60% at 50% -10%, #0d2d2a 0%, #050d0c 50%, #020608 100%)" }}>

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(20,180,160,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(20,180,160,0.025) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />

      {/* Top glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(20,184,166,0.10) 0%, transparent 70%)" }} />

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-[500px] relative z-10">

        {/* Header */}
        <div className="text-center mb-7">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 border border-teal-500/18 rounded-full px-4 py-1.5 mb-4"
            style={{ background: "rgba(20,184,166,0.06)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-teal-400/65">Provider Network</span>
          </motion.div>
          <h1 className="text-[26px] font-black tracking-tight text-white mb-1"
            style={{ fontFamily: "'Georgia', serif" }}>
            Join as a Provider
          </h1>
          <p className="text-sm text-slate-500">Complete all steps to get verified and start earning</p>
        </div>

        {/* Step tracker */}
        <div className="flex items-center mb-5 px-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div animate={{
                  scale: i === step ? 1.08 : 1,
                  borderColor: i < step ? "#14b8a6" : i === step ? "#2dd4bf" : "#334155",
                  backgroundColor: i < step ? "rgba(20,184,166,0.18)" : i === step ? "rgba(45,212,191,0.08)" : "rgba(15,23,42,0.7)",
                }} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-300">
                  {i < step
                    ? <span className="text-teal-400 font-bold text-sm">✓</span>
                    : <span className={i === step ? "text-teal-300" : "text-slate-600"}>{s.icon}</span>
                  }
                </motion.div>
                <span className={`text-[9px] mt-1 font-bold tracking-widest uppercase transition-colors
                  ${i === step ? "text-teal-400" : i < step ? "text-teal-600/70" : "text-slate-700"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-[1px] mb-4 relative overflow-hidden bg-slate-800/80">
                  <motion.div className="absolute inset-y-0 left-0"
                    animate={{ width: i < step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ background: "linear-gradient(90deg, #14b8a6, #0d9488)" }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(140deg, rgba(15,23,42,0.96) 0%, rgba(8,14,24,0.96) 100%)",
            border: "1px solid rgba(45,212,191,0.10)",
            boxShadow: "0 0 0 1px rgba(45,212,191,0.04), 0 30px 70px rgba(0,0,0,0.65), 0 0 100px rgba(20,184,166,0.04)"
          }}>

          {/* Progress bar */}
          <div className="h-[2px] bg-slate-900">
            <motion.div animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }} className="h-full"
              style={{ background: "linear-gradient(90deg, #0d9488, #14b8a6, #5eead4)" }} />
          </div>

          <div className="p-6 sm:p-8">
            {/* Step header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-700">
                  Step {step + 1} of {STEPS.length}
                </p>
                <p className="text-[15px] font-bold text-slate-200 mt-0.5">
                  {STEPS[step].icon} {STEPS[step].label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-700 font-mono">{Math.round(((step + 1) / STEPS.length) * 100)}%</p>
                <div className="mt-1 w-14 h-1 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    className="h-full rounded-full" style={{ background: "#14b8a6" }} />
                </div>
              </div>
            </div>

            {/* Animated content */}
            <div style={{ minHeight: "340px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step} custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 36 : -36, filter: "blur(3px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: direction > 0 ? -36 : 36, filter: "blur(3px)" }}
                  transition={{ duration: 0.26, ease: "easeInOut" }}>
                  {stepContent[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(51,65,85,0.35)" }}>
              {step > 0 && (
                <motion.button onClick={prev} whileTap={{ scale: 0.96 }} disabled={loading}
                  className="px-5 py-3 rounded-xl border border-slate-700/40 text-slate-400 text-sm font-semibold
                    hover:border-slate-600 hover:text-slate-300 transition-all duration-200 disabled:opacity-40">
                  ← Back
                </motion.button>
              )}

              {step < STEPS.length - 1 ? (
                <motion.button onClick={next} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide text-slate-900 relative overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
                  <span className="relative z-10">Continue →</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                    style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)" }} />
                </motion.button>
              ) : (
                <motion.button onClick={handleSubmit} disabled={loading} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide text-slate-900 relative overflow-hidden group disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">Submit Application ✓</span>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                        style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)" }} />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center mt-5 text-xs text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="text-teal-400/70 hover:text-teal-300 transition-colors font-semibold">Sign in</Link>
          <span className="mx-3 text-slate-800">|</span>
          <Link to="/register" className="text-teal-400/70 hover:text-teal-300 transition-colors font-semibold">Register as User</Link>
        </p>
      </motion.div>
    </div>
  );
};
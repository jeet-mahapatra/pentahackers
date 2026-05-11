
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UploadDocuments = () => {
  const [idProof, setIdProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!idProof || !addressProof) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("idProof", idProof);
      formData.append("addressProof", addressProof);

      await api.post("/provider/upload-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper component for the styled file input
  const FileUploadZone = ({ id, label, file, setFile, accent }) => (
    <div className="mb-5">
      <p className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-2 pl-1">
        {label}
      </p>
      <label 
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group
          ${file ? `border-[${accent}]/50 bg-[${accent}]/5` : "border-white/10 bg-white/[0.02] hover:border-[#2DD4BF]/30 hover:bg-white/[0.04]"}`}
      >
        {/* Hover Glow */}
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,${accent}10,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        
        <input 
          id={id} 
          type="file" 
          className="hidden" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
        {file ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-full bg-[${accent}]/20 flex items-center justify-center text-[${accent}] mb-3`}>
              ✓
            </div>
            <span className="text-white/90 font-semibold text-sm truncate max-w-[200px]">
              {file.name}
            </span>
            <span className={`text-[11px] text-[${accent}] mt-1 font-medium`}>
              Click to change file
            </span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 mb-3 group-hover:-translate-y-1 transition-transform">
              📄
            </div>
            <span className="text-white/60 font-medium text-sm">
              Click to browse files
            </span>
            <span className="text-[11px] text-white/30 mt-1">
              PDF, JPG, or PNG (Max 5MB)
            </span>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ 
        background: "#080C1C", 
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
      }}
    >
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(45,212,191,0.08)_0%,transparent_60%)] rounded-full blur-[60px]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,transparent_60%)] rounded-full blur-[80px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#080C1C]/80 backdrop-blur-2xl border border-white/[0.07] p-8 rounded-[30px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] z-10 relative overflow-hidden"
      >
        {/* Card Top Shimmer Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent opacity-50" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#2DD4BF]/20 to-[#0EA5E9]/20 border border-[#2DD4BF]/30 rounded-2xl flex items-center justify-center text-xl mb-4 shadow-[0_0_20px_rgba(45,212,191,0.15)]">
            🛡️
          </div>
          <h2 
            className="text-3xl font-black tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Verify <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#F59E0B]">Identity</span>
          </h2>
          <p className="text-white/40 text-[13px] mt-2">
            Upload your documents to complete your provider profile.
          </p>
        </div>

        <FileUploadZone 
          id="idProof" 
          label="Government ID Proof" 
          file={idProof} 
          setFile={setIdProof}
          accent="#2DD4BF" // Teal
        />

        <FileUploadZone 
          id="addressProof" 
          label="Address Proof" 
          file={addressProof} 
          setFile={setAddressProof}
          accent="#F59E0B" // Amber
        />

        <button 
          onClick={handleUpload}
          disabled={!idProof || !addressProof || loading}
          className="w-full mt-4 bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] text-[#080C1C] px-6 py-4 rounded-xl font-bold tracking-wide shadow-[0_8px_20px_rgba(45,212,191,0.25)] hover:shadow-[0_12px_25px_rgba(45,212,191,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex justify-center items-center h-[56px]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#080C1C] border-t-transparent rounded-full animate-spin" />
          ) : (
            "Submit Documents"
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default UploadDocuments;
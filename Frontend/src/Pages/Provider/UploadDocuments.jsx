import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const UploadDocuments = () => {
    const [idProof, setIdProof] = useState(null);
    const [addressProof, setAddressProof] = useState(null);
    const navigate = useNavigate();

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("idProof", idProof);
        formData.append("addressProof", addressProof);

        await api.post("/provider/upload-documents", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        navigate("/dashboard");
    };

    return (
        <div>
            <h2>Upload Documents</h2>

            <input type="file" onChange={(e) => setIdProof(e.target.files[0])} />
            <input type="file" onChange={(e) => setAddressProof(e.target.files[0])} />

            <button onClick={handleUpload}>Submit</button>
        </div>
    );
};

export default UploadDocuments;
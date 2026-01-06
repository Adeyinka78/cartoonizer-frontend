// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import ResumeGenerator from "./pages/ResumeGenerator";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import MainLayout from "./layouts/MainLayout";

function AvatarGenerator() {
  const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL &&
      import.meta.env.VITE_API_BASE_URL.trim()) ||
    "https://cartoonizer-backend-production-4203.up.railway.app";

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(1);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const sendToServer = async () => {
    if (credits <= 0) {
      alert("You have no credits left. Please purchase more.");
      return;
    }

    if (!image) {
      alert("Please upload a clear photo of yourself.");
      return;
    }

    setLoading(true);

    try {
      const base64 = await toBase64(image);

      const response = await fetch(`${API_BASE_URL}/cartoonize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: base64,
          style: "professional-avatar",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Image processing failed");
      }

      setResult(data.url);
      setCredits((c) => c - 1);
    } catch (err) {
      console.error("Avatar generation error:", err);
      alert("Avatar generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">✨ Premium AI Avatar Generator</h1>
      <p className="subtitle">
        Upload one photo. Get studio-quality AI avatars in seconds.
      </p>

      <p className="credits">
        🎟 Credits Remaining: <strong>{credits}</strong>
      </p>

      <a
        href="https://buy.stripe.com/14A6oH1BVbih3Jy40F4wM00"
        target="_blank"
        rel="noopener noreferrer"
        className="buy-btn"
      >
        Unlock More Avatars
      </a>

      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {preview && (
        <div className="preview-box">
          <h3>📸 Uploaded Photo</h3>
          <img src={preview} alt="original" className="image" />
        </div>
      )}

      <button className="btn" onClick={sendToServer} disabled={loading}>
        {loading ? "Generating Avatar..." : "Generate Premium Avatar"}
      </button>

      {result && (
        <div className="preview-box">
          <h3>🖼 Your AI-Generated Avatar</h3>
          <img src={result} alt="avatar result" className="image" />
          <a
            className="download"
            href={result}
            target="_blank"
            rel="noopener noreferrer"
          >
            ⬇ Download Avatar
          </a>
        </div>
      )}

      <p className="trust">
        🔒 Your photos are processed securely and never shared.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<AvatarGenerator />} />
          <Route path="/resume" element={<ResumeGenerator />} />
          <Route path="/linkedin" element={<LinkedInOptimizer />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
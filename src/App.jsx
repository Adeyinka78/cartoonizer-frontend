import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(1); // 1 free credit

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const sendToServer = async () => {
    if (credits <= 0) {
      alert("You are out of credits. Please buy more credits.");
      return;
    }

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    const base64 = await toBase64(image);

    fetch("https://cartoonizer-backend-production-4203.up.railway.app/cartoonize", {

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageData: base64.replace(/^data:image\/\w+;base64,/, ""),
        style: "anime",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setResult(data.url);
      setCredits((c) => c - 1);
    } else {
      alert("Error: " + data.error);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <div className="container">
      <h1 className="title">🎨 Cartoonizer AI</h1>
      <p className="subtitle">Upload your picture → Get a cartoon version</p>

      <p className="credits">
        💳 Credits remaining: <strong>{credits}</strong>
      </p>

      {/* BUY CREDITS BUTTON */}
      <a
        href="https://buy.stripe.com/14A6oH1BVbih3Jy40F4wM00?"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#6772e5",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px",
          margin: "12px 0",
        }}
      >
        Buy Cartoon Credits
      </a>

      <div className="upload-box">
        <input type="file" onChange={handleImageUpload} />
      </div>

      {preview && (
        <div className="preview-box">
          <h3>📷 Original Image</h3>
          <img src={preview} alt="preview" className="image" />
        </div>
      )}

      <button className="btn" onClick={sendToServer} disabled={loading}>
        {loading ? "Processing..." : "✨ Cartoonize Image"}
      </button>

      {result && (
        <div className="preview-box">
          <h3>🖼️ Cartoonized Result</h3>
          <img src={result} alt="result" className="image" />
          <a className="download" href={result} target="_blank">
            ⬇ Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default App;

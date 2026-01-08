import { useState } from "react";

export default function Cartoonizer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartoonImage, setCartoonImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string" && result.startsWith("data:image")) {
          console.log("✅ BASE64 SENT:", result.substring(0, 50));
          resolve(result);
        } else {
          reject("Invalid base64 format");
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setCartoonImage(null);
    setError("");

    try {
      const base64 = await toBase64(file);
      await generateCartoon(base64);
    } catch (err) {
      console.error("❌ Base64 conversion failed:", err);
      setError("Failed to process image");
    }
  };

  const generateCartoon = async (base64) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://cartoonizer-backend-production-4203.up.railway.app/cartoonize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        }
      );

      const data = await response.json();
      console.log("✅ SERVER RESPONSE:", data);

      if (data.cartoonImage) {
        setCartoonImage(data.cartoonImage);
      } else if (data.cartoonImageBase64) {
        setCartoonImage(data.cartoonImageBase64);
      } else {
        throw new Error("Invalid cartoon response");
      }
    } catch (err) {
      console.error("❌ Avatar generation error:", err);
      setError("Avatar generation failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <h2>AI Cartoonizer</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && <p>Generating Avatar...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedImage && (
        <>
          <h4>Original</h4>
          <img
            src={selectedImage}
            alt="original"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </>
      )}

      {cartoonImage && (
        <>
          <h4>Cartoon</h4>
          <img
            src={cartoonImage}
            alt="cartoon"
            style={{ width: "100%", borderRadius: 8 }}
          />
          <a
            href={cartoonImage}
            download="cartoon.png"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "10px 20px",
              background: "#000",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Download Avatar
          </a>
        </>
      )}
    </div>
  );
}
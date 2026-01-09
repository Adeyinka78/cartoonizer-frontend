import { useState } from "react";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartoonImage, setCartoonImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      console.log("✅ BASE64 SENT:", base64.substring(0, 50));

      generateCartoon(base64);
    };

    reader.readAsDataURL(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const generateCartoon = async (base64) => {
    try {
      setLoading(true);

      // ⭐ REQUIRED DEBUG LOG — CONFIRMS WHAT WE SEND TO BACKEND
      console.log(
        "FETCH BODY:",
        JSON.stringify({ image: base64 }).substring(0, 120)
      );

      const response = await fetch(
        "https://cartoonizer-backend-production-4203.up.railway.app/cartoonize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64 }), // ⭐ MUST BE "image"
        }
      );

      const data = await response.json();
      console.log("✅ SERVER RESPONSE:", data);

      if (!data.cartoonImage) {
        throw new Error("Invalid cartoon response");
      }

      setCartoonImage(data.cartoonImage);
    } catch (error) {
      console.error("❌ Avatar generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Cartoonizer</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && <p>Generating cartoon...</p>}

      {selectedImage && (
        <div>
          <h3>Original</h3>
          <img src={selectedImage} width="250" />
        </div>
      )}

      {cartoonImage && (
        <div>
          <h3>Cartoon</h3>
          <img src={cartoonImage} width="250" />
        </div>
      )}
    </div>
  );
}
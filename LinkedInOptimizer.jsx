// src/pages/LinkedInOptimizer.jsx
import { useState } from "react";

export default function LinkedInOptimizer() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    role: "",
    industry: "",
    experience: "",
    skills: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const optimize = async () => {
    setLoading(true);
    setProfile(null);

    try {
      const res = await fetch(`${API_BASE}/linkedin-optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role,
          industry: form.industry,
          experience: form.experience.split("\n"),
          skills: form.skills.split(","),
        }),
      });

      const data = await res.json();
      setProfile(data.profile || null);
    } catch (err) {
      setProfile({
        headline: "Error optimizing profile.",
        about: "",
        experience: "",
        skills: [],
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">LinkedIn Optimizer</h1>

      <div className="grid gap-4">
        <input
          name="role"
          placeholder="Target Role"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="industry"
          placeholder="Industry"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <textarea
          name="experience"
          placeholder="Experience (one per line)"
          className="border p-3 rounded h-32"
          onChange={handleChange}
        />

        <input
          name="skills"
          placeholder="Skills (comma separated)"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <button
          onClick={optimize}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Optimizing..." : "Optimize Profile"}
        </button>
      </div>

      {profile && (
        <div className="space-y-6 bg-gray-100 p-4 rounded">
          <div>
            <h2 className="font-bold text-xl">Headline</h2>
            <p>{profile.headline}</p>
          </div>

          <div>
            <h2 className="font-bold text-xl">About</h2>
            <p className="whitespace-pre-wrap">{profile.about}</p>
          </div>

          <div>
            <h2 className="font-bold text-xl">Experience</h2>
            <pre className="whitespace-pre-wrap">{profile.experience}</pre>
          </div>

          <div>
            <h2 className="font-bold text-xl">Skills</h2>
            <ul className="list-disc ml-6">
              {profile.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
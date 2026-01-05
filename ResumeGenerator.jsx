// src/pages/ResumeGenerator.jsx
import { useState } from "react";

export default function ResumeGenerator() {
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "",
    experience: "",
    skills: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateResume = async () => {
    setLoading(true);
    setResume("");

    try {
      const res = await fetch(`${API_BASE}/generate-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          experience: form.experience.split("\n"),
          skills: form.skills.split(","),
        }),
      });

      const data = await res.json();
      setResume(data.resume || "No resume returned.");
    } catch (err) {
      setResume("Error generating resume.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Resume Generator</h1>

      <div className="grid gap-4">
        <input
          name="name"
          placeholder="Your Name"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="role"
          placeholder="Target Role"
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
          onClick={generateResume}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </div>

      {resume && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {resume}
        </pre>
      )}
    </div>
  );
}
// src/layouts/MainLayout.jsx
import { NavLink } from "react-router-dom";
import "../App.css";

export default function MainLayout({ children }) {
  return (
    <div>
      {/* Top Navigation */}
      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Avatar Generator
        </NavLink>

        <NavLink
          to="/resume"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Resume Generator
        </NavLink>

        <NavLink
          to="/linkedin"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          LinkedIn Optimizer
        </NavLink>
      </nav>

      {/* Page Content */}
      <main style={{ padding: "20px" }}>{children}</main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "40px",
          padding: "20px",
          textAlign: "center",
          color: "#777",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} Premium AI Branding Suite — Built by Adeyinka
      </footer>
    </div>
  );
}
// src/MainLayout.jsx
import { NavLink } from "react-router-dom";
import "./App.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout-container">
      <nav className="navbar">
        <h2 className="logo">AI Branding Suite</h2>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Avatar Generator
          </NavLink>

          <NavLink
            to="/resume"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Resume Generator
          </NavLink>

          <NavLink
            to="/linkedin"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            LinkedIn Optimizer
          </NavLink>
        </div>
      </nav>

      <main className="content">{children}</main>
    </div>
  );
}
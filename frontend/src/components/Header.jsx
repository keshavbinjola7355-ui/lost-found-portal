import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../src/images/screen.png";
import { House, LogOut, SearchCheck, Archive, FolderSearch2 } from "lucide-react";
import "../style/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user name from localStorage
  const user = JSON.parse(localStorage.getItem("college-user") || "null");
  const userName = user?.name || "Keshav";

  const handleLogout = () => {
    // Clear user and navigate to login
    localStorage.removeItem("college-user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="logo" />
        College Lost & Found
      </div>
      <nav>
        <div className={isActive("/") ? "active" : ""}>
          <Link className="nav-link" to="/">Home</Link>
        </div>
        <div className={isActive("/reportLost") ? "active" : ""}>
          <Link className="nav-link" to="/reportLost">Report Lost</Link>
        </div>
        <div className={isActive("/reportfound") ? "active" : ""}>
          <Link className="nav-link" to="/reportfound">Report Found</Link>
        </div>
        <div className={isActive("/myreports") ? "active" : ""}>
          <Link className="nav-link" to="/myreports">My Reports</Link>
        </div>
      </nav>

      <div className="auth">
        <div>{userName}</div>
        <button onClick={handleLogout} title="Logout">
          <span>
            <LogOut />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;

